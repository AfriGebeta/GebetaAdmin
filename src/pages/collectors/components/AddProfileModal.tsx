//@ts-nocheck
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import mapLoader from '/animation.webm'
import api from '@/services/api.ts'
import useLocalStorage from '@/hooks/use-local-storage.tsx'

interface AddProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber: string
    collectionBoundary: { latitude: string; longitude: string }[] | string
  }) => void
}

const AddProfileModal: React.FC<AddProfileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [coordinates, setCoordinates] = useState<
    { latitude: string; longitude: string }[]
  >([])
  const [boundaries, setBoundaries] = useState<
    {
      name: string
      bounds: { latitude: string; longitude: string }[]
    }[]
  >([])
  const [selectedBoundary, setSelectedBoundary] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  useEffect(() => {
    const fetchBoundaries = async () => {
      const response = await api.getBoundary({ apiAccessToken })
      const data = await response.json()
      setBoundaries(data.data)
      console.log(data.data)
    }
    fetchBoundaries()
  }, [])

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

  const handleSubmit = async () => {
    setLoading(true)
    const phoneNumber2 = `+251${phoneNumber}`
    const selectedBoundaryData = boundaries.find(
      (boundary) => boundary.name === selectedBoundary
    )
    const formattedBounds = selectedBoundaryData
      ? selectedBoundaryData.bounds.map((bound) => {
          const [latitude, longitude] = bound.split(' ')
          return { latitude, longitude }
        })
      : coordinates
    console.log('Data being sent:', {
      firstName,
      lastName,
      email,
      password,
      phoneNumber: phoneNumber2,
      collectionBoundary: selectedBoundaryData?.id ?? formattedBounds,
    })
    await onSubmit({
      firstName,
      lastName,
      email,
      password,
      phoneNumber: phoneNumber2,
      collectionBoundary: selectedBoundaryData?.id ?? formattedBounds,
    })
    setLoading(false)
  }

  useEffect(() => {
    if (!isOpen) {
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setPhoneNumber('')
      setLatitude('')
      setLongitude('')
      setCoordinates([])
      setSelectedBoundary('')
    }
  }, [isOpen])

  const polylinePositions = coordinates.map((coord) => [
    parseFloat(coord.latitude),
    parseFloat(coord.longitude),
  ])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[70%]'>
        <DialogHeader>
          <DialogTitle>Add Profile</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className='flex w-full flex-col items-center'>
            <video autoPlay loop src={mapLoader} />
            <p>Adding collector...</p>
          </div>
        ) : (
          <div className='space-y-4'>
            <div>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='First name'
              />
            </div>
            <div>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                id='lastName'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Last name'
              />
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
              />
            </div>
            <div>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
              />
            </div>
            <div>
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <div className='relative mt-1 rounded-md shadow-sm'>
                <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium  text-muted-foreground'>
                  +251
                </span>
                <Input
                  id='phoneNumber'
                  className='pl-12'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder=''
                />
              </div>
            </div>
            <div>
              <Label htmlFor='boundary'>Boundary</Label>
              <select
                className='block w-full rounded-lg border-gray-200 px-3 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
                id='collectionBoundary'
                value={selectedBoundary}
                onChange={(e) => setSelectedBoundary(e.target.value)}
              >
                <option value=''>Select boundary</option>
                {boundaries?.length > 0 &&
                  boundaries?.map((boundary, index) => (
                    <option key={index} value={boundary.name}>
                      {boundary.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='flex-1'>
                <Label htmlFor='coordinate'>Coordinate</Label>
                <Input
                  id='latitude'
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder='Latitude'
                />
              </div>
              <div className='mt-5 flex-1'>
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
      </DialogContent>
    </Dialog>
  )
}

export default AddProfileModal
