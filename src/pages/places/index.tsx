//@ts-nocheck
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { UserNav } from '@/components/user-nav'
import { useAppDispatch } from '@/data/redux/hooks'
import useLocalStorage from '@/hooks/use-local-storage'
import { Place } from '@/model'
import api, { RequestError } from '@/services/api'
import { getFeatureAccessToken } from '@/utils/token-feat'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import { columns } from './components/columns.tsx'
import { DataTable } from './components/data-table.tsx'
import { useQuery } from '@tanstack/react-query'
import AddPlaceModal from '@/pages/places/components/AddPlaceModal.tsx'
import EditPlaceModal from '@/pages/places/components/EditPlaceModal.tsx'
import { Filter, X } from 'lucide-react'

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

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [city, setCity] = useState('')
  const [debouncedCity, setDebouncedCity] = useState('')
  const [country, setCountry] = useState('')
  const [debouncedCountry, setDebouncedCountry] = useState('')
  const [type, setType] = useState('')
  const [debouncedType, setDebouncedType] = useState('')

  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const [count, setCount] = useState(0)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(city.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [city])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCountry(country.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [country])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedType(type.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [type])

  //resetting
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [debouncedSearchTerm, debouncedCity, debouncedCountry, debouncedType])

  const { data } = useQuery({
    queryKey: [
      'places',
      pagination.pageIndex,
      pagination.pageSize,
      debouncedSearchTerm,
      debouncedCity,
      debouncedCountry,
      debouncedType,
    ],
    queryFn: () =>
      debouncedSearchTerm
        ? searchPlaces(debouncedSearchTerm)
        : debouncedCity || debouncedCountry || debouncedType
          ? filterPlaces(
              debouncedCity,
              debouncedCountry,
              debouncedType,
              pagination.pageIndex + 1,
              pagination.pageSize
            )
          : fetchPlaces(pagination.pageIndex + 1, pagination.pageSize),
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
        return { places: [], count: 0 }
      }
    } catch (e) {
      toast({
        title: 'Error',
        description: 'An error occurred while fetching places',
        variant: 'destructive',
      })
      return { places: [], count: 0 }
    } finally {
      setRequesting(false)
    }
  }

  async function searchPlaces(query: string) {
    try {
      setRequesting(true)
      const featureAccessToken = getFeatureAccessToken(currentProfile)

      if (!featureAccessToken) {
        toast({
          title: 'Error',
          description: 'no token.',
          variant: 'destructive',
        })
        return { places: [], count: 0 }
      }

      const response = await api.searchPlaces({
        name: query,
        apiKey: featureAccessToken,
      })

      if (response.ok) {
        const result = await response.json()
        const places = Array.isArray(result.data)
          ? result.data.map((place: any, index: number) => ({
              id: place.id || index.toString(),
              name: place.name || '',
              type: place.type || 'unknown',
              city: place.City || '',
              country: place.Country || '',
              longitude: place.longitude || 0,
              latitude: place.latitude || 0,
            }))
          : []

        setCount(places.length)
        setPlaceData(places)
        return { places, count: places.length }
      } else {
        const error = await response.json()
        toast({
          title: 'Search Error',
          description: error.message || 'failed to search :( ',
          variant: 'destructive',
        })
        return { places: [], count: 0 }
      }
    } catch (e) {
      toast({
        title: 'Error',
        description: 'error searching :( ',
        variant: 'destructive',
      })
      return { places: [], count: 0 }
    } finally {
      setRequesting(false)
    }
  }

  async function filterPlaces(
    cityQuery: string,
    countryQuery: string,
    typeQuery: string,
    page: number,
    limit: number
  ) {
    try {
      setRequesting(true)
      const featureAccessToken = getFeatureAccessToken(currentProfile)

      if (!featureAccessToken) {
        toast({
          title: 'Error',
          description: 'no token.',
          variant: 'destructive',
        })
        return { places: [], count: 0 }
      }

      const response = await api.filterPlaces({
        apiKey: featureAccessToken,
        apiAccessToken: String(apiAccessToken),
        city: cityQuery || undefined,
        country: countryQuery || undefined,
        type: typeQuery || undefined,
        page,
        limit,
      })

      if (response.ok) {
        const result = await response.json()
        const places = result?.data?.places || []
        const countVal =
          result?.data?.count ?? (Array.isArray(places) ? places.length : 0)

        setCount(countVal)
        setPlaceData(Array.isArray(places) ? places : [])
        return { places: Array.isArray(places) ? places : [], count: countVal }
      } else {
        const error = await response.json()
        toast({
          title: 'filter  error',
          description: error.message || 'failed to filter :(',
          variant: 'destructive',
        })
        return { places: [], count: 0 }
      }
    } catch (e) {
      toast({
        title: 'error',
        description: 'error filtering :(',
        variant: 'destructive',
      })
      return { places: [], count: 0 }
    } finally {
      setRequesting(false)
    }
  }

  const addFilter = (filterType: string) => {
    if (!activeFilters.includes(filterType)) {
      setActiveFilters([...activeFilters, filterType])
    }
  }

  const removeFilter = (filterType: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filterType))

    if (filterType === 'city') setCity('')
    if (filterType === 'country') setCountry('')
    if (filterType === 'type') setType('')
  }

  const resetAllFilters = () => {
    setActiveFilters([])
    setCity('')
    setCountry('')
    setType('')
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
        place: { ...data, apiKey: String(currentProfile.token[0]) },
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
        <div className='mb-2 space-y-2'>
          <div className='flex justify-between'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Places</h2>
              <p className='mb-4 text-muted-foreground'>
                Places managed by the application
              </p>
            </div>
            <div>
              <Button
                className='font-medium'
                onClick={() => setAddPlaceModalOpen(true)}
              >
                Add Place
              </Button>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className='relative'>
              <Input
                placeholder='Search places by name...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-64 pr-8'
              />
              {searchTerm && (
                <button
                  type='button'
                  aria-label='Clear search'
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                  onClick={() => setSearchTerm('')}
                >
                  <X className='h-3 w-3' />
                </button>
              )}
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className='mr-2 h-4 w-4' /> Filters
            </Button>
          </div>

          {showFilters && (
            <div className='mt-2 space-y-2'>
              <div className='flex flex-wrap items-center gap-2'>
                {!activeFilters.includes('city') && (
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => addFilter('city')}
                  >
                    + City
                  </Button>
                )}
                {!activeFilters.includes('country') && (
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => addFilter('country')}
                  >
                    + Country
                  </Button>
                )}
                {!activeFilters.includes('type') && (
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => addFilter('type')}
                  >
                    + Type
                  </Button>
                )}

                {activeFilters.length > 0 && (
                  <Button variant='ghost' size='sm' onClick={resetAllFilters}>
                    Reset
                  </Button>
                )}
              </div>

              {activeFilters.includes('city') && (
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <Input
                      placeholder='Filter by city...'
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className='w-64 pr-8'
                    />
                    {city && (
                      <button
                        type='button'
                        aria-label='Clear city'
                        className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        onClick={() => setCity('')}
                      >
                        <X className='h-3 w-3' />
                      </button>
                    )}
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => removeFilter('city')}
                  >
                    X
                  </Button>
                </div>
              )}

              {activeFilters.includes('country') && (
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <Input
                      placeholder='Filter by country...'
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className='w-64 pr-8'
                    />
                    {country && (
                      <button
                        type='button'
                        aria-label='Clear country'
                        className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        onClick={() => setCountry('')}
                      >
                        <X className='h-3 w-3' />
                      </button>
                    )}
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => removeFilter('country')}
                  >
                    X
                  </Button>
                </div>
              )}

              {activeFilters.includes('type') && (
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <Input
                      placeholder='Filter by type...'
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className='w-64 pr-8'
                    />
                    {type && (
                      <button
                        type='button'
                        aria-label='Clear type'
                        className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        onClick={() => setType('')}
                      >
                        <X className='h-3 w-3' />
                      </button>
                    )}
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => removeFilter('type')}
                  >
                    X
                  </Button>
                </div>
              )}
            </div>
          )}
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
