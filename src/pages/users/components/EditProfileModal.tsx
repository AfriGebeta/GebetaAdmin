import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'

import mapLoader from '/animation.webm'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; email: string; phoneNumber: string }) => void
  profileData: {
    name: string
    email: string
    phoneNumber: string
  }
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  profileData,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setName(profileData.name)
    setEmail(profileData.email)
    setPhoneNumber(profileData.phoneNumber)
  }, [profileData])

  const handleSubmit = async () => {
    setLoading(true)
    await onSubmit({
      name,
      email,
      phoneNumber,
    })
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[50%]'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className='flex w-full flex-col items-center '>
            <video autoPlay loop src={mapLoader} />
            <h3 className=''>Updating profile...</h3>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='space-y-1'>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='First name'
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
              />
            </div>

            <Button
              onClick={handleSubmit}
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
