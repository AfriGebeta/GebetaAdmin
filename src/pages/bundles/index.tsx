//@ts-nocheck
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { UserNav } from '@/components/user-nav'
import { useAppDispatch, useAppSelector } from '@/data/redux/hooks'
import { selectProfiles, updateProfile } from '@/data/redux/slices/profiles'
import useLocalStorage from '@/hooks/use-local-storage'
import { Profile } from '@/model'
import api, { RequestError } from '@/services/api'
import 'leaflet/dist/leaflet.css'
import moment from 'moment'
import { useEffect, useState } from 'react'
import AddProfileModal from './components/AddBundleModal.tsx'
import { columns } from './components/columns.tsx'
import { DataTable } from './components/data-table.tsx'

import EditBundleModal from './components/EditBundleModal.tsx'
import DeleteProfileModal from './components/DeleteProfileModal.tsx'
import { Bundle } from '@/model/bundle.ts'
import { useQuery } from '@tanstack/react-query'

export default function Bundles() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })
  const [requesting, setRequesting] = useState(false)
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null)
  const [isAddProfileModalOpen, setAddProfileModalOpen] = useState(false)
  const [isEditBundleModalOpen, setEditBundleModalOpen] = useState(false)
  const [isDeleteBundleModalOpen, setDeleteBundleModalOpen] = useState(false)
  const [bundleData, setBundleData] = useState([])

  const [count, setCount] = useState(0)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const { data } = useQuery({
    queryKey: ['bundles', pagination.pageIndex, pagination.pageSize],
    queryFn: () => fetchBundles(pagination.pageIndex + 1, pagination.pageSize),
    staleTime: 1000 * 60 * 5,
  })

  async function fetchBundles(page, limit) {
    try {
      setRequesting(true)
      const response = await api.getBundles({
        apiAccessToken: String(apiAccessToken),
        page: page,
        limit: limit,
      })
      if (response.ok) {
        const result = (await response.json()) as {
          data: Array<Bundle>
        }

        setCount(result.data.count)
        return result.data
      } else {
        const responseData = (await response.json()).error as RequestError
        toast({
          title: `${responseData.namespace}/${responseData.code}`,
          description: responseData.message,
          variant: 'destructive',
        })
      }
    } catch (e) {
      toast({
        title: 'Ohh.. Something went wrong!`,',
        description: `Here is ${e.message}`,
        variant: 'destructive',
      })
    } finally {
      setRequesting(false)
    }
  }

  console.log(count)

  const handleAddBundle = async (data: {
    name: string
    price: number
    rate: number
    expirationDate: string
    callCaps: number[]
    includedCallTypes: string[]
    expiredIn: number
  }) => {
    try {
      const response = await api.createBundle({
        apiAccessToken: String(apiAccessToken),
        bundleData: data,
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: 'Bundle Added',
          description: 'The bundle has been added successfully!',
          variant: 'default',
        })
      } else {
        const error = (await response.json()).error
        toast({
          title: 'Error Adding Bundle',
          description: error.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Request Failed',
        description: 'Check your network connection!',
        variant: 'destructive',
      })
    } finally {
      setAddProfileModalOpen(false)
    }
  }

  const handleEditBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle)
    setEditBundleModalOpen(true)
  }

  const handleDeleteBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle)
    setDeleteBundleModalOpen(true)
  }

  const handleDeleteBundleData = async (id: string) => {
    if (selectedBundle) {
      const selectedId = selectedBundle.id
      try {
        await api.deleteBundle({ apiAccessToken, id: selectedId })
        setDeleteBundleModalOpen(false)
      } catch (error) {
        toast({ title: 'Unsuccesfull Deleting bundle' })
      }
    }
  }

  const handleUpdateBundle = async (data: {
    includedCallTypes: string[]
    name: string
    rate: number
    price: number
    expirationDate: string
    callCaps: number[]
    expiredIn: number
  }) => {
    if (selectedBundle) {
      try {
        const response = await api.updateBundle({
          apiAccessToken: String(apiAccessToken),
          id: selectedBundle.id,
          data: {
            includedCallTypes: data.includedCallTypes,
            name: data.name,
            rate: data.rate,
            price: data.price,
            expirationDate: data.expirationDate,
            callCaps: data.callCaps,
            expiredIn: data.expiredIn,
          },
        })

        if (response.ok) {
          toast({
            title: 'Bundle Updated',
            description: 'The bundle has been updated successfully!',
            variant: 'default',
          })
        } else {
          const error = await response.json()
          toast({
            title: 'Error Updating Bundle',
            description: error.message,
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.log(error)
        toast({
          title: 'Request Failed',
          description: 'Check your network connection!',
          variant: 'destructive',
        })
      } finally {
        setEditBundleModalOpen(false)
      }
    }
  }

  useEffect(() => {
    console.log(data)
  }, [data])

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
            <h2 className='text-2xl font-bold tracking-tight'>Bundles</h2>
            <p className='mb-4 text-muted-foreground'>
              Bundles managed by the application
            </p>
          </div>
          <Button
            className='font-medium'
            onClick={() => setAddProfileModalOpen(true)}
          >
            Add Bundle
          </Button>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={
              data?.credit_bundles.map((v) => ({
                id: v.id,
                name: v.name,
                price: v.price,
                rate: v.rate,
                expiredIn: v.expiredIn,
                expirationDate: moment(v.expirationDate).format('DD/MM/YYYY'),
                callCaps: v.call_caps,
                includedCallTypes: v.included_call_types,
              })) || ([] as any)
            }
            columns={columns}
            fetching={requesting}
            onEdit={handleEditBundle}
            onDelete={handleDeleteBundle}
            count={count || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>

        <AddProfileModal
          isOpen={isAddProfileModalOpen}
          onClose={() => setAddProfileModalOpen(false)}
          onSubmit={handleAddBundle}
        />

        {selectedBundle && (
          <EditBundleModal
            bundleData={selectedBundle}
            isOpen={isEditBundleModalOpen}
            onClose={() => setEditBundleModalOpen(false)}
            onSubmit={handleUpdateBundle}
          />
        )}

        {selectedBundle && (
          <DeleteProfileModal
            id={selectedBundle.id}
            isOpen={isDeleteBundleModalOpen}
            onClose={() => setDeleteBundleModalOpen(false)}
            onSubmit={handleDeleteBundleData}
          />
        )}
      </LayoutBody>
    </Layout>
  )
}
