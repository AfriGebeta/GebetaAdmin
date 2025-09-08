import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { useEffect, useMemo, useState } from 'react'
import useLocalStorage from '@/hooks/use-local-storage'
import { getFeatureAccessToken } from '@/utils/token-feat'
import api from '@/services/api'
import moment from 'moment'

interface UsageGraphProps {
  range?: string
}

export default function UsageGraph({ range = 'last-month' }: UsageGraphProps) {
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
  const [data, setData] = useState<Array<{ day: string; total: number }>>([])

  const getDateRange = (range: string) => {
    const endDate = moment().format('YYYY-MM-DD')
    let startDate: string

    switch (range) {
      case 'last-week':
        startDate = moment().subtract(1, 'week').format('YYYY-MM-DD')
        break
      case 'last-month':
        startDate = moment().subtract(1, 'month').format('YYYY-MM-DD')
        break
      case 'last-3-months':
        startDate = moment().subtract(3, 'months').format('YYYY-MM-DD')
        break
      case 'last-6-months':
        startDate = moment().subtract(6, 'months').format('YYYY-MM-DD')
        break
      case 'last-year':
        startDate = moment().subtract(1, 'year').format('YYYY-MM-DD')
        break
      default:
        startDate = moment().subtract(1, 'month').format('YYYY-MM-DD')
    }

    return { startDate, endDate }
  }

  useEffect(() => {
    const load = async () => {
      try {
        if (!featureAccessToken) return
        const { startDate, endDate } = getDateRange(range)
        const res = await api.getUsageGraph({
          apiAccessToken: String(apiAccessToken),
          apiKey: featureAccessToken,
          startDate,
          endDate,
          type: 'ALL',
        })
        if (res.ok) {
          const j = await res.json()
          const rows = Array.isArray(j?.data) ? j.data : []
          const mapped = rows.map((r: any) => ({
            day: moment(r.Day).format('MMM DD'),
            total: r.Total ?? 0,
          }))
          setData(mapped)
        }
      } catch {}
    }
    load()
  }, [apiAccessToken, featureAccessToken, range])

  return (
    <div className='h-[400px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='day'
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor='end'
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            formatter={(value: number) => [
              value.toLocaleString(),
              'Total Usage',
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type='monotone'
            dataKey='total'
            stroke='#2563eb'
            strokeWidth={2}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
