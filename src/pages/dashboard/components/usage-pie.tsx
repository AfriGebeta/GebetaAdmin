import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { useEffect, useMemo, useState } from 'react'
import useLocalStorage from '@/hooks/use-local-storage'
import { getFeatureAccessToken } from '@/utils/token-feat'
import api from '@/services/api'
import moment from 'moment'

// const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#22c55e']
const COLORS = [
  '#2563eb',
  '#f59e0b',
  '#f97316',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#16a34a',
  '#22c55e',
]

interface UsagePieProps {
  range?: string
}

export default function UsagePie({ range = 'last-month' }: UsagePieProps) {
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
  const [data, setData] = useState<Array<{ name: string; value: number }>>([])

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
        const res = await api.getUsageMatrixTotal({
          apiAccessToken: String(apiAccessToken),
          apiKey: featureAccessToken,
          startDate,
          endDate,
        })
        if (res.ok) {
          const j = await res.json()
          const rows = Array.isArray(j?.data) ? j.data : []
          const mapped = rows.map((r: any) => ({
            name: r.calltype ?? r.callType ?? r.CallType,
            value: r.total ?? r.Total ?? 0,
          }))
          setData(mapped)
        }
      } catch {}
    }
    load()
  }, [apiAccessToken, featureAccessToken, range])

  return (
    <div className='h-[360px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={120}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
