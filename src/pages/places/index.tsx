//@ts-nocheck
import 'leaflet/dist/leaflet.css'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { useEffect, useRef, useState } from 'react'
import { Place, PlaceType } from '@/model'
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
import { iconCurrent, iconMap } from '@/pages/places/data/map-icons.ts'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge.tsx'
import { Card, CardContent } from '@/components/ui/card.tsx'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel.tsx'

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

  const [currentPlace, setCurrentPlace] = useState<string | null>(null)

  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const [openPlaceEditor, setOpenPlaceEditor] = useState(false)

  const pagination = useRef<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  })

  // function updatePlaceEditFormState(id: string) {
  //   const place = places[id];
  //
  //   const _place = {
  //     ...defaultPlace,
  //     ...pick(place, Object.keys(defaultPlace))
  //   }
  //
  //   console.log({ _place, place, id, places });
  //
  //   Object
  //     .keys(defaultPlace)
  //     .forEach(key => {
  //       if(key !== "location") { //@ts-ignore
  //         placeEditForm.setValue(key, _place[key])
  //       }
  //     });
  // }

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

  // useEffect(() => {
  //   const id = setTimeout(
  //     () =>
  //       void fetchPlaces({
  //         limit: pagination.current.pageSize,
  //         offset: Object.keys(places).length,
  //       }),
  //     0
  //   )
  //   return () => clearTimeout(id)
  // }, [])

  useEffect(() => {
    if (Object.keys(places).length)
      setLastPlaceId(
        Object.values(places).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0].id
      )
  }, [places])

  useEffect(() => {
    fetchPlaces({
      limit: pagination.current.pageSize,
      offset: pagination.current.pageIndex * pagination.current.pageSize,
    })
  }, [pagination.current.pageIndex, pagination.current.pageSize])

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
                      contact: v.contact,
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
                    icon={
                      v.id === lastPlaceId
                        ? iconCurrent
                        : (iconMap[v.type] ?? iconMap[PlaceType.OTHER])
                    }
                  >
                    <Popup>
                      <Card>
                        <CardContent>
                          <br />
                          {`${v.names.official['EN']}`} <br /> <br />
                          {`${v.names.official['AM']}`} <br /> <br />
                          <b>{`${v.type}${v.type === PlaceType.OTHER ? ` (${v.customType})` : ''}`}</b>{' '}
                          <br /> <br />
                          {``}{' '}
                          <Link
                            target='_blank'
                            to={`https://www.google.com/maps?q=${v.location?.latitude}, ${v.location?.latitude}`}
                          >
                            <Badge variant='outline'>
                              {v.location?.latitude}, {v.location?.latitude}
                            </Badge>
                          </Link>{' '}
                          <br /> <br />
                          {`${moment(v.createdAt).format(
                            'ddd DD, MMM YYYY [at] HH:mm:ss a'
                          )}`}{' '}
                          <br /> <br />
                          <b>{`${v.status}`}</b> <br /> <br />
                          <Dialog>
                            {v.images?.map((image, index) => (
                              <>
                                <DialogTrigger>
                                  <Avatar className='border border-muted'>
                                    <AvatarImage src={image} />
                                    <AvatarFallback>{index + 1}</AvatarFallback>
                                  </Avatar>
                                </DialogTrigger>
                              </>
                            ))}
                            <DialogContent className='max-w-screen z-[1000] h-full items-center justify-center border-none bg-transparent'>
                              <Carousel className='w-full max-w-xs'>
                                <CarouselContent className='items-center'>
                                  {v.images?.map((image, index) => (
                                    <CarouselItem key={index}>
                                      <div className='p-1'>
                                        <div className='flex items-center justify-center overflow-hidden rounded-md border border-muted'>
                                          <img src={image} alt={'image'} />
                                        </div>
                                      </div>
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                                {v.images?.length > 1 && (
                                  <>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                  </>
                                )}
                              </Carousel>
                            </DialogContent>
                          </Dialog>
                          <br /> <br />
                          {Boolean(v.contact?.phone?.primary) && (
                            <>
                              <Link
                                target='_blank'
                                to={`tel:${v.contact?.phone?.primary}`}
                              >
                                {`${v.contact?.phone?.primary}`}{' '}
                              </Link>{' '}
                              <br /> <br />
                            </>
                          )}
                          {Boolean(v.contact?.email?.primary) && (
                            <>
                              <Link
                                target='_blank'
                                to={`mailto:${v.contact?.email?.primary}`}
                              >
                                {`${v.contact?.email?.primary}`}{' '}
                              </Link>{' '}
                              <br /> <br />
                            </>
                          )}
                          {Boolean(v.contact?.socialMedia?.website) && (
                            <>
                              <Link
                                target='_blank'
                                to={v.contact?.socialMedia?.website}
                              >
                                <u>{`${v.contact?.socialMedia?.website}`}</u>
                              </Link>{' '}
                              <br />
                            </>
                          )}
                        </CardContent>
                      </Card>
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
