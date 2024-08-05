import Loader from '@/components/loader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    collectionBoundary: { latitude: string; longitude: string }[]
  }) => void
  profileData: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    collectionBoundary: {
      bounds: string[]
    }
  }
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  profileData,
}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [coordinates, setCoordinates] = useState<
    { latitude: string; longitude: string }[]
  >([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFirstName(profileData.firstName)
    setLastName(profileData.lastName)
    setEmail(profileData.email)
    setPhoneNumber(profileData.phoneNumber)

    const parsedCoordinates =
      profileData?.collectionBoundary?.bounds?.map((coord) => {
        const [lat, lng] = coord.split(' ')
        return { latitude: lat, longitude: lng }
      }) || []
    setCoordinates(parsedCoordinates)
  }, [profileData])

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
    setLoading(true)
    console.log('submitting', loading)
    await onSubmit({
      firstName,
      lastName,
      email,
      phoneNumber,
      collectionBoundary: coordinates,
    })
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        {loading ? (
          <Loader />
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
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <Input
                id='phoneNumber'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder='Phone Number(+251------)'
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
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileModal
