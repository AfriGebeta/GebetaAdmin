//@ts-nocheck
import 'leaflet/dist/leaflet.css'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { useEffect, useRef, useState } from 'react'
import { Place } from '@/model'
import eventsource from '@/services/eventsource.ts'
import api, { RequestError } from '@/services/api.ts'
import useLocalStorage from '@/hooks/use-local-storage.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { ToastAction } from '@/components/ui/toast.tsx'
import moment from 'moment'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { TabsContent } from '@radix-ui/react-tabs'
import { useAppDispatch, useAppSelector } from '@/data/redux/hooks.ts'
import {
  addPlace,
  addPlaces,
  selectPlaces,
} from '@/data/redux/slices/places.ts'
import { PaginationState } from '@tanstack/react-table'

export default function Places() {
  const dispatch = useAppDispatch()

  const { toast } = useToast()

  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const places = useAppSelector(selectPlaces)

  const [requesting, setRequesting] = useState(false)

  const [count, setCount] = useState(Object.keys(places).length)

  const [lastPlaceId, setLastPlaceId] = useState<string | null>(null)

  const pagination = useRef<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  })

  async function fetchPlaces({
    limit,
    offset,
  }: {
    limit: number
    offset: number
  }) {
    try {
      setRequesting(true)

      console.log('calling with: ', { limit, offset })

      const response = await api.getPlaces({
        apiAccessToken: String(apiAccessToken),
        offset,
        limit,
        orderBy: JSON.stringify([{ by: 'createdAt', direction: 'DESC' }]),
      })

      if (response.ok) {
        const result = (await response.json()) as {
          count: number
          atOffset: number
          data: Array<Place>
        }

        dispatch(addPlaces(result.data))
        setCount(result.count)
      } else {
        const responseData = (await response.json()).error as RequestError

        toast({
          title: `${responseData.namespace}/${responseData.code}`,
          description: responseData.message,
          variant: 'destructive',
        })
      }
    } catch (e) {
      console.error(e)

      toast({
        title: 'Request Failed',
        description: 'Check your network connection!',
        variant: 'destructive',
        action: (
          <ToastAction
            altText='Try again'
            onClick={() =>
              fetchPlaces({
                limit: pagination.current.pageSize,
                offset: Object.keys(places).length,
              })
            }
          >
            Try again
          </ToastAction>
        ),
      })
    } finally {
      setRequesting(false)
    }
  }

  useEffect(() => {
    const eventSource = eventsource.subscribeToPlaces()

    eventSource.addEventListener('PLACE_ADDED', (event) => {
      console.log({ event })

      console.log({ data: event.data })

      const addedPlace = JSON.parse(event.data).data.place as Place

      console.log({ addedPlace })

      dispatch(addPlace(addedPlace))
      setCount((_count) => _count + 1)
    })

    return () => eventSource.close()
  }, [])

  useEffect(() => {
    const id = setTimeout(
      () =>
        void fetchPlaces({
          limit: pagination.current.pageSize,
          offset: Object.keys(places).length,
        }),
      0
    )
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (Object.keys(places).length)
      setLastPlaceId(
        Object.values(places).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0].id
      )
  }, [places])

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        {/*<Search />*/}
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Data Horde</h2>
            <p className='text-muted-foreground'>
              Place data set collected by people
            </p>
          </div>
        </div>

        <Tabs
          orientation='vertical'
          defaultValue='tableview'
          className='space-y-4'
        >
          <div className='w-full pb-2'>
            <TabsList>
              <TabsTrigger value='tableview'>Table View</TabsTrigger>
              <TabsTrigger value='mapview'>Map View</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='tableview' className='space-y-4'>
            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
              <DataTable
                data={
                  Object.values(places)
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((v) => ({
                      id: v.id,
                      type: v.type,
                      customType: v.customType,
                      latitude: v.location.latitude,
                      longitude: v.location.longitude,
                      name: v.names.official,
                      status: v.status,
                      createdAt: moment(v.createdAt).format(
                        'ddd DD, MMM YYYY [at] HH:mm:ss a'
                      ),
                      addedBy: v.addedBy,
                      images: v.images,
                      address: v.address,
                    })) as any
                }
                columns={columns}
                onFetch={() =>
                  fetchPlaces({
                    limit: pagination.current.pageSize,
                    offset: Object.keys(places).length,
                  })
                }
                fetching={requesting}
                count={count}
                onPaginationChange={(_pagination) => {
                  pagination.current = _pagination
                }}
              />
            </div>
          </TabsContent>
          <TabsContent value='mapview' className='space-y-4'>
            <div className='-mx-4 mx-1 my-1 flex-1 overflow-auto overflow-hidden rounded-md border lg:flex-row lg:space-x-12 lg:space-y-0'>
              <MapContainer
                style={{ height: '30rem', width: '100%', overflow: 'hidden' }}
                center={[
                  places[lastPlaceId]?.location?.latitude ?? 9.03,
                  places[lastPlaceId]?.location?.longitude ?? 38.74,
                ]}
                zoom={18}
                maxZoom={30}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                {Object.values(places).map((v) => (
                  <Marker
                    key={v.id}
                    position={[v.location.latitude, v.location.longitude]}
                  >
                    <Popup>
                      {`Name: ${v.names.official['EN']}`} <br />
                      {`Location: ${v.location?.latitude} ${v.location?.latitude}`}{' '}
                      <br />
                      {`Address: ${v.address?.borough}, ${v.address?.district}`}{' '}
                      <br />
                      {`Status: ${v.status}`} <br />
                      {`Image count: ${Number(v.images?.length)}`} <br />
                      {`Type: ${v.type}`} <br />
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  )
}
