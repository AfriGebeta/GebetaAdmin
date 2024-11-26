import api, { RequestError } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import useLocalStorage from '@/hooks/use-local-storage.tsx'
import { Bundle } from '@/model/bundle.ts'

export const useGetPlans = () => {
  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  async function fetchBundles(page: number, limit: number) {
    try {
      const response = await api.getBundles({
        apiAccessToken: String(apiAccessToken),
        page: page,
        limit: limit,
      })
      if (response.ok) {
        const result = (await response.json()) as {
          data: Array<Bundle>
        }
        return result.data
      } else {
        const responseData = (await response.json()).error as RequestError
        return responseData.message
      }
    } catch (e) {
      return e
    }
  }

  return useQuery({
    queryKey: ['plans'],
    queryFn: () => fetchBundles(1, 10),
  })
}
