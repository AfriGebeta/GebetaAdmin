import {
  Layout,
  LayoutHeader,
  LayoutBody,
} from '@/components/custom/layout.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { Button } from '@/components/ui/button.tsx'
import { PlusIcon } from 'lucide-react'
import { columns } from './components/columns.tsx'
import { DataTable } from './components/data-table.tsx'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from '@/data/redux/hooks.ts'
import { useToast } from '@/components/ui/use-toast.ts'
import useLocalStorage from '@/hooks/use-local-storage.tsx'
import { useState, useEffect } from 'react'
import api, { RequestError } from '@/services/api.ts'
import { Boundary } from '@/model/profile.ts'
import { ToastAction } from '@/components/ui/toast.tsx'
import { addBoundary, selectBoundary } from '@/data/redux/slices/boundary.ts'

export default function Boundaries() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })
  const boundary = useAppSelector(selectBoundary)
  const [requesting, setRequesting] = useState(false)

  async function fetchBoundary() {
    try {
      setRequesting(true)
      const response = await api.getBoundary({
        apiAccessToken: String(apiAccessToken),
      })

      if (response.ok) {
        const result = (await response.json()) as {
          data: Array<Boundary>
        }

        dispatch(addBoundary(result.data))
      } else {
        const responseData = (await response.json()).error as RequestError

        toast({
          title: `${responseData.namespace} / ${responseData.code}`,
          description: responseData.message,
          variant: 'destructive',
        })
      }
    } catch (e) {
      console.log(e)
      toast({
        title: 'Request Failed',
        description: 'Check your internet connection',
        variant: 'destructive',
        action: (
          <ToastAction altText='Try again' onClick={fetchBoundary}>
            Try again
          </ToastAction>
        ),
      })
    } finally {
      setRequesting(false)
    }
  }

  useEffect(() => {
    fetchBoundary()
  }, [])

  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Boundary</h2>
            <p className='mb-4 text-muted-foreground'>
              Boundary managed by the application
            </p>
          </div>
          <Button onClick={() => {}} className='font-semibold'>
            <PlusIcon size={18} className='mr-2' />
            Add Boundary
          </Button>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={
              Object.values(boundary)
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((v) => ({
                  id: v.id,
                  name: v.name,
                  bounds: v.bounds,
                  radius: v.radius,
                  center: v.center,
                  createdAt: moment(v.createdAt).format('ddd DD, MMM YYYY'),
                })) as any
            }
            columns={columns}
            onFetch={fetchBoundary}
            fetching={requesting}
          />
        </div>
      </LayoutBody>
    </Layout>
  )
}
