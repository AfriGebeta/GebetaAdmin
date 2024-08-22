//@ts-nocheck

import {
  Layout,
  LayoutHeader,
  LayoutBody,
} from '@/components/custom/layout.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Minus, PlusIcon, Trash2Icon } from 'lucide-react'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '@/services/api.ts'
import mapLoader from '/animation.webm'
import { Input } from '@/components/ui/input.tsx'
import { MapContainer, Polyline, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import useLocalStorage from '@/hooks/use-local-storage.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { Label } from '@/components/ui/label.tsx'

export default function AddBoundary() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const [coordinates, setCoordinates] = useState<
    { latitude: string; longitude: string }[]
  >([])
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [name, setName] = useState('')
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
    const data = { collectionBoundary: { name, bounds: coordinates } }

    const response = await api.createBoundary({
      apiAccessToken: String(apiAccessToken),
      name: name,
      bounds: coordinates,
    })

    if (response.ok) {
      navigate('/boundary')
      toast({
        title: 'Adding boundary',
        description: 'boundary added successfully',
      })
    } else {
      const error = (await response.json()).error
      toast({
        title: 'Error adding boundary',
        description: error.message,
        variant: 'destructive',
      })
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
              <p>Adding boundary...</p>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='mb-4 mt-8 flex-1'>
                <Label htmlFor='name' className='mb-4'>
                  Boundary Name
                </Label>
                <Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Name'
                  className='mt-4 w-fit'
                />
              </div>
              <Label className='mb-0'>Bounds</Label>
              <div className='mt-0 flex items-center space-x-2'>
                <div className='flex-1'>
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
                  <Button onClick={handleAddCoordinate} variant='ghost'>
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
                        className='mt-2 flex items-center justify-between rounded-md p-2'
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
                            className='mr-4 w-1/2'
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
                          variant='ghost'
                        >
                          <Minus size={18} />
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
