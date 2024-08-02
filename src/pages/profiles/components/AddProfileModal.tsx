//@ts-nocheck
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface AddProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber: string
    collectionBoundary: { latitude: string; longitude: string }[]
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

  const handleSubmit = () => {
    onSubmit({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      collectionBoundary: coordinates,
    })
  }

  const polylinePositions = coordinates.map((coord) => [
    parseFloat(coord.latitude),
    parseFloat(coord.longitude),
  ])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Profile</DialogTitle>
        </DialogHeader>
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
            <Input
              id='phoneNumber'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder='Phone Number'
            />
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
      </DialogContent>
    </Dialog>
  )
}

export default AddProfileModal
