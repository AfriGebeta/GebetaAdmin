//@ts-nocheck

import {
  Layout,
  LayoutHeader,
  LayoutBody,
} from '@/components/custom/layout.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { Button } from '@/components/ui/button.tsx'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '@/services/api.ts'
import mapLoader from '/animation.webm'
import { Input } from '@/components/ui/input.tsx'
import { MapContainer, Polyline, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import useLocalStorage from '@/hooks/use-local-storage.tsx'

export default function AddBoundary() {
  const navigate = useNavigate()
  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const [coordinates, setCoordinates] = useState<
    { latitude: string; longitude: string }[]
  >([])
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddCoordinate = () => {
    if (latitude && longitude) {
      setCoordinates([...coordinates, { latitude, longitude }])
      setLatitude('')
      setLongitude('')
    }
  }

  const handleDeleteCoordinate = (index: number) => {
    setCoordinates(coordinates.filter((_, i) => i !== index))
  }

  const handleCoordinateChange = (
    index: number,
    key: 'latitude' | 'longitude',
    value: string
  ) => {
    const updatedCoordinates = [...coordinates]
    updatedCoordinates[index] = { ...updatedCoordinates[index], [key]: value }
    setCoordinates(updatedCoordinates)
  }

  const polylinePositions = coordinates.map((coord) => [
    parseFloat(coord.latitude),
    parseFloat(coord.longitude),
  ])

  const handleSubmit = async () => {
    setLoading(true)
    const reponse = await api.createBoundary({
      boundaryData: coordinates,
      apiAccessToken: String(apiAccessToken),
    })
    if (!reponse.ok) {
      console.log('some problem in the backend')
    } else {
      console.log('fine by me')
    }
    setLoading(false)
  }

  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      <LayoutBody>
        <div>
          <Button
            onClick={() => navigate('/boundary')}
            className='font-semibold'
            variant='secondary'
          >
            <ArrowLeftIcon className='mr-2' />
            Go back
          </Button>
        </div>
        <div className='mt-10'>
          <h2 className='text-xl font-bold tracking-tight'>Add Boundary</h2>
          {loading ? (
            <div className='flex w-full flex-col items-center'>
              <video autoPlay loop src={mapLoader} />
              <p>Adding collector...</p>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='mt-6 flex items-center space-x-2'>
                {/*<div className="flex-1">*/}
                {/*  <Label htmlFor="name">Name</Label>*/}
                {/*  <Input*/}
                {/*    id="latitude"*/}
                {/*    value={name}*/}
                {/*    onChange={(e) => setName(e.target.value)}*/}
                {/*    placeholder="Name"*/}
                {/*  />*/}
                {/*</div>*/}
                <div className='flex-1'>
                  {/*<Label htmlFor="coordinate">Bounds</Label>*/}
                  <Input
                    id='latitude'
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder='Latitude'
                  />
                </div>
                <div className='flex-1'>
                  <Input
                    id='longitude'
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder='Longitude'
                  />
                </div>
                <div className='flex items-center'>
                  <Button
                    onClick={handleAddCoordinate}
                    className='bg-[#ffa818]'
                  >
                    <PlusIcon size={18} />
                  </Button>
                </div>
              </div>
              <div>
                {coordinates.length > 0 && (
                  <ul className='mt-2'>
                    {coordinates.map((coord, index) => (
                      <li
                        key={index}
                        className='mt-2 flex items-center justify-between rounded-md border p-2'
                      >
                        <div className='flex'>
                          <Input
                            value={coord.latitude}
                            onChange={(e) =>
                              handleCoordinateChange(
                                index,
                                'latitude',
                                e.target.value
                              )
                            }
                            className='mr-2 w-1/2'
                          />
                          <Input
                            value={coord.longitude}
                            onChange={(e) =>
                              handleCoordinateChange(
                                index,
                                'longitude',
                                e.target.value
                              )
                            }
                            className='w-1/2'
                          />
                        </div>
                        <Button
                          onClick={() => handleDeleteCoordinate(index)}
                          variant='outline'
                          className='ml-2 border-none bg-[#ffa818]'
                        >
                          <Trash2Icon size={18} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {coordinates.length > 0 && (
                <div className='mt-4 h-48'>
                  <MapContainer
                    center={[
                      parseFloat(coordinates[0].latitude),
                      parseFloat(coordinates[0].longitude),
                    ]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Polyline positions={polylinePositions} color='#ffa818' />
                  </MapContainer>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                variant='outline'
                className='bg-[#ffa818] font-semibold text-white'
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </LayoutBody>
    </Layout>
  )
}
