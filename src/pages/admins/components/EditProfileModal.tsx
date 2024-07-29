import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    email: string
    phoneNumber: string
    collectionBoundary: { bounds: string[] }
  }) => void
  profile: {
    name: string
    email: string
    phoneNumber: string
    collectionBoundary: { bounds: string[] }
  } | null
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  profile,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [bounds, setBounds] = useState<string[]>([])

  useEffect(() => {
    if (profile) {
      setName(profile.name)
      setEmail(profile.email)
      setPhoneNumber(profile.phoneNumber)
      setBounds(profile.collectionBoundary.bounds)
    }
  }, [profile])

  const handleAddCoordinate = () => {
    setBounds([...bounds, `${latitude} ${longitude}`])
    setLatitude('')
    setLongitude('')
  }

  const handleSubmit = () => {
    onSubmit({
      name,
      email,
      phoneNumber,
      collectionBoundary: { bounds },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <Label htmlFor='phoneNumber'>Phone Number</Label>
            <Input
              id='phoneNumber'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='latitude'>Latitude</Label>
            <Input
              id='latitude'
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='longitude'>Longitude</Label>
            <Input
              id='longitude'
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
          <Button onClick={handleAddCoordinate}>Add Coordinate</Button>
          <div>
            {bounds && (
              <ul className=''>
                {bounds.map((coord, index) => (
                  <li
                    className='mr-2 mt-2 inline-flex items-center whitespace-nowrap rounded-md border px-2.5 py-0.5 text-xs font-semibold text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    key={index}
                  >
                    {coord}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileModal
