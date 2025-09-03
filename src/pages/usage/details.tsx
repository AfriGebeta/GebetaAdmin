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
      const response = await api.getUsageMatrix({
        apiAccessToken: String(apiAccessToken),
        apiKey: featureAccessToken,
        userId,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
      })
      if (response.ok) {
        const result = await response.json()
        const rows = Array.isArray(result?.data) ? result.data : []
        const normalized = rows.map((r: any) => ({
          calltype: r.calltype ?? r.callType ?? r.CallType ?? 'UNKNOWN',
          total: r.total ?? r.Total ?? 0,
        }))
        setUsage(normalized)
      } else {
        const err = await response.json()
        toast({
          title: 'Usage Error',
          description: err?.error?.message || 'Failed to load usage',
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
    fetchUsage()
  }, [])

  const total = usage.reduce((acc, u) => acc + (u.total ?? 0), 0)

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
            Export
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
            <div className='text-3xl font-bold'>{total}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
