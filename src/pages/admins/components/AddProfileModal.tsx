// AddProfileModal.tsx

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
import { PlusIcon } from 'lucide-react'

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
            />
          </div>
          <div>
            <Label htmlFor='lastName'>Last Name</Label>
            <Input
              id='lastName'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='phoneNumber'>Phone Number</Label>
            <Input
              id='phoneNumber'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className='flex items-center space-x-2'>
            <Label htmlFor='latitude'>Coordinate</Label>
            <div className='flex-1'>
              <Input
                id='latitude'
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div className='flex-1'>
              <Input
                id='longitude'
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
            <div className='flex items-center'>
              <Button
                onClick={handleAddCoordinate}
                variant='outline'
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
                    className='mr-2 mt-2 inline-flex items-center whitespace-nowrap rounded-md border px-2.5 py-0.5 text-xs font-semibold text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    key={index}
                  >
                    {`Lat: ${coord.latitude}, Lng: ${coord.longitude}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button onClick={handleSubmit} className='bg-[#ffa818]'>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddProfileModal
