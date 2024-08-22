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
import { useState, useEffect } from 'react'
import api, { RequestError } from '@/services/api.ts'
import 'leaflet/dist/leaflet.css'
import useLocalStorage from '@/hooks/use-local-storage.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { useParams } from 'react-router-dom'
import { Boundary } from '@/model'
import mapLoader from '/animation.webm'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'

export default function UpdateBoundary() {
  const { id } = useParams()
  console.log(id)

  const navigate = useNavigate()

  const { toast } = useToast()

  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const [name, setName] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [coordinates, setCoordinates] = useState<
    { latitude: string; longitude: string }[]
  >([])

  const [loading, setLoading] = useState(false)

  const [boundaryData, setBoundaryData] = useState<Boundary>(null)

  async function fetchBoundary() {
    try {
      const response = await api.getSpecificBoundary({
        apiAccessToken: String(apiAccessToken),
        id,
      })

      if (response.ok) {
        const result = (await response.json()) as {
          data: Boundary
        }

        setBoundaryData(result.data)
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
        title: 'Error fetching boundary',
        description: 'An error occurred while fetching boundary',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    setName(boundaryData?.name)
    setCoordinates(boundaryData?.bounds)

    const parsedCoordinates =
      boundaryData?.bounds?.map((coord) => {
        const [lat, lng] = coord.split(' ')
        return { latitude: lat, longitude: lng }
      }) || []
    setCoordinates(parsedCoordinates)
  }, [boundaryData])

  const handleAddCoordinate = () => {
    if (
      latitude &&
      longitude &&
      !isNaN(parseFloat(latitude)) &&
      !isNaN(parseFloat(longitude))
    ) {
      setCoordinates([...coordinates, { latitude, longitude }])
      setLatitude('')
      setLongitude('')
    } else {
      console.log('please enter coordinate correctly')
    }
  }

  const handleDeleteCoordinate = (index: number) => {
    setCoordinates(coordinates?.filter((_, i) => i !== index))
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

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const data = { name, bounds: coordinates }
      console.log('Data being sent:', data)

      const response = await api.updateBoundary({
        apiAccessToken: String(apiAccessToken),
        id: id,
        boundaryData: { name, bounds: coordinates },
      })
      console.log(response)
      if (response.ok) {
        navigate('/boundary')
        toast({
          title: 'Updating boundary',
          description: 'boundary updated successfully',
        })
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
      })
    } finally {
      setLoading(false)
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
          <h2 className='text-xl font-bold tracking-tight'>Edit Boundary</h2>
        </div>
        {loading ? (
          <div className='flex w-full flex-col items-center '>
            <video autoPlay loop src={mapLoader} />
            <h3 className=''>Updating profile...</h3>
          </div>
        ) : (
          <div className='space-y-4'>
            <div>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Boundary name'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <div className='flex-1'>
                <Label htmlFor='latitude'>Latitude</Label>
                <Input
                  id='latitude'
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder='Latitude'
                />
              </div>
              <div className='flex-1'>
                <Label htmlFor='longitude'>Longitude</Label>
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
                  className='translate-y-[10px] bg-[#ffa818]'
                >
                  <PlusIcon size={18} />
                </Button>
              </div>
            </div>
            <div>
              {coordinates?.length > 0 && (
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

            <Button
              onClick={handleSubmit}
              variant='ghost'
              className='bg-[#ffa818] font-semibold text-white'
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        )}
      </LayoutBody>
    </Layout>
  )
}
