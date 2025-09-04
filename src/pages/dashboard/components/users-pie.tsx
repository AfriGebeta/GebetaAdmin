import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { useEffect, useState } from 'react'
import useLocalStorage from '@/hooks/use-local-storage'
import api from '@/services/api'

const COLORS = ['#f59e0b', '#16a34a']

export default function UsersPie() {
  const [apiAccessToken] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })
  const [data, setData] = useState<Array<{ name: string; value: number }>>([])

  useEffect(() => {
    const load = async () => {
      try {
        const resAll = await api.getUsers({
          apiAccessToken: String(apiAccessToken),
          page: 1,
          limit: 1,
        })

        const resCredit = await api.getUsers({
          apiAccessToken: String(apiAccessToken),
          page: 1,
          limit: 1,
          creditUser: true,
        })

        if (resAll.ok && resCredit.ok) {
          const allJson = await resAll.json()
          const totalUsers: number = allJson?.data?.count ?? 0

          const creditJson = await resCredit.json()
          const creditUsers: number = creditJson?.data?.count ?? 0
          const otherUsers = Math.max(totalUsers - creditUsers, 0)

          setData([
            { name: 'Credit Users', value: creditUsers },
            { name: 'Pay as you go', value: otherUsers },
          ])
        }
      } catch {}
    }
    load()
  }, [apiAccessToken])

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
