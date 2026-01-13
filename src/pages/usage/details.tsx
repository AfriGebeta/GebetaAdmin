import { useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import useLocalStorage from '@/hooks/use-local-storage'
import { getFeatureAccessToken } from '@/utils/token-feat'
import api from '@/services/api'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import moment from 'moment'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { calculatePrice, resolveFeatureKey } from '@/utils/pricing'

const VAT_RATE = 0.15

const formatMoney = (value: number) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export default function UsageDetails() {
  const { toast } = useToast()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const userId = query.get('userId') || ''

  const [apiAccessToken] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })
  const [currentProfile] = useLocalStorage({
    key: 'currentProfile',
    defaultValue: null,
  })
  const featureAccessToken = useMemo(
    () => getFeatureAccessToken(currentProfile),
    [currentProfile]
  )

  const [startDate, setStartDate] = useState<Date | null>(
    new Date(moment().subtract(30, 'days').format('YYYY-MM-DD'))
  )
  const [endDate, setEndDate] = useState<Date | null>(new Date())
  const [openStart, setOpenStart] = useState(false)
  const [openEnd, setOpenEnd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [usage, setUsage] = useState<
    Array<{ calltype: string; total: number }>
  >([])
  const [dailyUsage, setDailyUsage] = useState<
    Array<{ date: string; total: number; calltype?: string }>
  >([])
  const [exchangeRate, setExchangeRate] = useState<number>(0)

  const exportCsv = () => {
    const rows = [
      ['startDate', 'endDate', 'calltype', 'total'],
      ...usage.map((u) => [
        moment(startDate).format('YYYY-MM-DD'),
        moment(endDate).format('YYYY-MM-DD'),
        u.calltype,
        String(u.total),
      ]),
      ['', '', 'TOTAL', String(total)],
    ]
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const filename = `usage_${moment(startDate).format('YYYYMMDD')}_${moment(endDate).format('YYYYMMDD')}.csv`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportPdf = () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
    })

    const start = moment(startDate).format('YYYY-MM-DD')
    const end = moment(endDate).format('YYYY-MM-DD')

    doc.setFontSize(14)
    doc.text('Usage Summary', 40, 40)
    doc.setFontSize(10)
    doc.text(`User ID: ${userId}`, 40, 58)
    doc.text(`Range: ${start} to ${end}`, 40, 72)

    // Build one row per day in the selected range.
    // If there is no usage for a date, show 0.
    const usageByDate = new Map<string, number>()
    dailyUsage.forEach((d) => {
      const key = moment(d.date).format('YYYY-MM-DD')
      usageByDate.set(key, (usageByDate.get(key) ?? 0) + (d.total ?? 0))
    })

    const startMoment = startDate
      ? moment(startDate)
      : moment().subtract(30, 'days')
    const endMoment = endDate ? moment(endDate) : moment()

    const bodyRows: string[][] = []
    let cursor = startMoment.clone()
    let index = 1

    while (cursor.isSameOrBefore(endMoment, 'day')) {
      const dateStr = cursor.format('YYYY-MM-DD')
      const totalForDay = usageByDate.get(dateStr) ?? 0

      bodyRows.push([String(index++), dateStr, totalForDay.toLocaleString()])

      cursor = cursor.add(1, 'day')
    }

    autoTable(doc, {
      head: [['No', 'Date', 'Calls']],
      body: bodyRows,
      startY: 90,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 120 },
        2: { halign: 'right' },
      },
    })

    const summaryY = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 20
      : 120

    doc.setFontSize(11)
    doc.text(`Total Calls: ${totalCalls.toLocaleString()}`, 40, summaryY)
    doc.text(`Total Amount in USD: ${formatMoney(usdTotal)}`, 40, summaryY + 18)
    doc.text(
      `ETB (${exchangeRate.toFixed(2)}): ${formatMoney(etbTotal)}`,
      40,
      summaryY + 36
    )
    doc.text(`VAT (15%): ${formatMoney(vatAmount)}`, 40, summaryY + 54)
    doc.text(
      `Total Amount Including VAT: ${formatMoney(totalIncludingVat)}`,
      40,
      summaryY + 72
    )

    doc.setFontSize(9)
    doc.text(
      `Average exchange rate ${exchangeRate.toFixed(2)} ETB per USD `,
      40,
      summaryY + 96
    )

    doc.save(
      `usage_${userId}_${moment(startDate).format('YYYYMMDD')}_${moment(
        endDate
      ).format('YYYYMMDD')}.pdf`
    )
  }

  const fetchUsage = async () => {
    if (!userId || !startDate || !endDate) return
    if (!featureAccessToken) {
      toast({
        title: 'Error',
        description: 'Missing feature token',
        variant: 'destructive',
      })
      return
    }
    try {
      setLoading(true)
      const [matrixResponse, graphResponse] = await Promise.all([
        api.getUsageMatrix({
          apiAccessToken: String(apiAccessToken),
          apiKey: featureAccessToken,
          userId,
          startDate: moment(startDate).format('YYYY-MM-DD'),
          endDate: moment(endDate).format('YYYY-MM-DD'),
        }),
        api.getUsage({
          apiAccessToken: String(apiAccessToken),
          id: userId,
          startDate: moment(startDate).format('YYYY-MM-DD'),
          endDate: moment(endDate).format('YYYY-MM-DD'),
        }),
      ])

      if (matrixResponse.ok) {
        const result = await matrixResponse.json()
        const rows = Array.isArray(result?.data) ? result.data : []
        const normalized = rows.map((r: any) => ({
          calltype: r.calltype ?? r.callType ?? r.CallType ?? 'UNKNOWN',
          total: r.total ?? r.Total ?? 0,
        }))
        setUsage(normalized)
      } else {
        const err = await matrixResponse.json()
        toast({
          title: 'Usage Error',
          description: err?.error?.message || 'Failed to load usage',
          variant: 'destructive',
        })
      }

      if (graphResponse.ok) {
        const result = await graphResponse.json()
        const rows = Array.isArray(result?.data) ? result.data : []
        const normalizedDaily = rows
          .map((r: any) => ({
            date: r.Day ?? r.day ?? r.date ?? '',
            total: Number(r.Total ?? r.total ?? 0),
            calltype: r.calltype ?? r.callType ?? r.CallType,
          }))
          .filter((r: any) => r.date)
          .map((r: any) => ({
            ...r,
            date: moment(r.date).format('YYYY-MM-DD'),
          }))
        setDailyUsage(normalizedDaily)
      } else if (graphResponse.status !== 404) {
        const err = await graphResponse.json()
        toast({
          title: 'Usage Error',
          description: err?.error?.message || 'Failed to load usage graph',
          variant: 'destructive',
        })
      }
    } catch (e) {
      toast({
        title: 'Network Error',
        description: 'Check your connection',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        )
        const data = await response.json()
        if (data?.rates?.ETB) {
          setExchangeRate(Math.ceil(data.rates.ETB * 100) / 100)
        }
      } catch (error) {}
    }

    fetchExchangeRate()
    fetchUsage()
  }, [])

  const total = usage.reduce((acc, u) => acc + (u.total ?? 0), 0)
  const totalCalls = useMemo(() => {
    if (dailyUsage.length > 0)
      return dailyUsage.reduce((acc, d) => acc + (d.total ?? 0), 0)
    return total
  }, [dailyUsage, total])

  const usdTotal = useMemo(() => {
    return usage.reduce((acc, u) => {
      const featureKey = resolveFeatureKey(u.calltype)
      if (!featureKey) return acc
      return acc + calculatePrice(featureKey, u.total)
    }, 0)
  }, [usage])

  const etbTotal = usdTotal * exchangeRate
  const vatAmount = etbTotal * VAT_RATE
  const totalIncludingVat = etbTotal + vatAmount

  return (
    <div className='mx-auto w-full max-w-6xl p-4'>
      <div className='mb-4 mt-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Usage</h2>
          <p className='mb-2 text-muted-foreground'>Usages for selected user</p>
        </div>
        <div className='flex flex-col gap-2 md:flex-row md:items-center'>
          <Popover open={openStart} onOpenChange={setOpenStart}>
            <PopoverTrigger asChild>
              <Button variant='outline' className='w-[180px] justify-start'>
                {startDate
                  ? moment(startDate).format('YYYY-MM-DD')
                  : 'Choose start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent align='start' className='p-0'>
              <Calendar
                mode='single'
                selected={startDate as any}
                onSelect={(d: any) => {
                  setStartDate(d)
                  setOpenStart(false)
                }}
              />
            </PopoverContent>
          </Popover>

          <Popover open={openEnd} onOpenChange={setOpenEnd}>
            <PopoverTrigger asChild>
              <Button variant='outline' className='w-[180px] justify-start'>
                {endDate
                  ? moment(endDate).format('YYYY-MM-DD')
                  : 'Choose end date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent align='start' className='p-0'>
              <Calendar
                mode='single'
                selected={endDate as any}
                onSelect={(d: any) => {
                  setEndDate(d)
                  setOpenEnd(false)
                }}
              />
            </PopoverContent>
          </Popover>

          <Button
            onClick={fetchUsage}
            disabled={loading}
            className='whitespace-nowrap'
          >
            {loading ? 'Loading...' : 'Apply'}
          </Button>
          <Button
            onClick={exportCsv}
            variant='secondary'
            className='whitespace-nowrap'
          >
            Export CSV
          </Button>
          <Button
            onClick={exportPdf}
            variant='secondary'
            className='whitespace-nowrap'
          >
            Export PDF
          </Button>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {usage.length === 0 && (
          <Card className='sm:col-span-2 lg:col-span-4'>
            <CardHeader>
              <CardTitle className='text-sm font-medium'>
                No usage found for selected range
              </CardTitle>
            </CardHeader>
          </Card>
        )}
        {usage.map((u) => (
          <Card key={u.calltype}>
            <CardHeader>
              <CardTitle className='text-sm font-medium'>
                {u.calltype}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>{u.total}</div>
            </CardContent>
          </Card>
        ))}
        <Card className='bg-[#ffa818] text-white'>
          <CardHeader>
            <CardTitle className='text-md font-bold text-white'>
              TOTAL
            </CardTitle>
          </CardHeader>
          <CardContent className=''>
            <div className='text-3xl font-bold'>{totalCalls}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
