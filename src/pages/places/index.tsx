//@ts-nocheck
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { UserNav } from '@/components/user-nav'
import { useAppDispatch } from '@/data/redux/hooks'
import useLocalStorage from '@/hooks/use-local-storage'
import { Place } from '@/model'
import api, { RequestError } from '@/services/api'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { columns } from './components/columns.tsx'
import { DataTable } from './components/data-table.tsx'
import { useQuery } from '@tanstack/react-query'
import AddPlaceModal from '@/pages/places/components/AddPlaceModal.tsx'

export default function Places() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })
  const [currentProfile, _] = useLocalStorage({
    key: 'currentProfile',
    defaultValue: null,
  })
  const [placeData, setPlaceData] = useState<Place[]>([])
  const [requesting, setRequesting] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [isAddPlaceModalOpen, setAddPlaceModalOpen] = useState(false)
  const [isEditPlaceModalOpen, setEditPlaceModalOpen] = useState(false)

  const [count, setCount] = useState(0)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const { data } = useQuery({
    queryKey: ['places', pagination.pageIndex, pagination.pageSize],
    queryFn: () => fetchPlaces(pagination.pageIndex + 1, pagination.pageSize),
    staleTime: 1000 * 60 * 5,
  })

  async function fetchPlaces(page, limit) {
    try {
      setRequesting(true)
      const response = await api.getPlaces({
        apiAccessToken: String(apiAccessToken),
        page,
        limit,
      })
      if (response.ok) {
        const result = (await response.json()) as {
          data: {
            count: number
            places: Array<Place>
          }
        }

        setCount(result.data.count)
        setPlaceData(result.data.places)
        console.log(result.data.places)
        return { places: result.data.places, count: result.data.count }
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
        title: 'Error',
        description: 'An error occurred while fetching places',
        variant: 'destructive',
      })
    } finally {
      setRequesting(false)
    }
  }

  const handleAddPlace = async (data: {
    name: string
    city: string
    country: string
    lat: string
    lon: string
    type: string
    apiKey: string
  }) => {
    try {
      const response = await api.createPlace({
        apiAccessToken: String(currentProfile.token[0]),
        place: data,
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: 'Place Added',
          description: 'The place has been added successfully!',
          variant: 'default',
        })
      } else {
        const error = (await response.json()).error
        toast({
          title: 'Error Adding Place',
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
      setAddPlaceModalOpen(false)
    }
  }

  const handleUpdatePlace = async (data: {
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

  const handleEditPlace = (place: Place) => {
    setSelectedPlace(place)
    setEditPlaceModalOpen(true)
  }

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
            <h2 className='text-2xl font-bold tracking-tight'>Places</h2>
            <p className='mb-4 text-muted-foreground'>
              Places managed by the application
            </p>
          </div>
          <Button
            className='font-medium'
            onClick={() => setAddPlaceModalOpen(true)}
          >
            Add Place
          </Button>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={
              data?.places?.map((v) => ({
                id: v.id,
                name: v.name,
                type: v.type,
                ownedBy: v.ownedBy,
                city: v.city,
                country: v.country,
                longitude: v.longitude,
                latitude: v.latitude,
              })) || ([] as any)
            }
            columns={columns}
            fetching={requesting}
            count={data?.count || 0}
            pagination={pagination}
            onEdit={handleEditPlace}
            onPaginationChange={setPagination}
          />
        </div>

        <AddPlaceModal
          isOpen={isAddPlaceModalOpen}
          onClose={() => setAddPlaceModalOpen(false)}
          onSubmit={handleAddPlace}
        />

        {selectedPlace && (
          <EditPlaceModal
            placeData={selectedPlace}
            isOpen={isEditPlaceModalOpen}
            onClose={() => setEditPlaceModalOpen(false)}
            onSubmit={handleUpdatePlace}
          />
        )}
      </LayoutBody>
    </Layout>
  )
}
