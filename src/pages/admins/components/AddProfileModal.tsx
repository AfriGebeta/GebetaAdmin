import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface AddProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    username: string
    password: string
    companyName: string
    email: string
    phoneNumber: string
  }) => void
}

const AddProfileModal: React.FC<AddProfileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [companyName, setCompanyName] = useState('')

  const handleSubmit = () => {
    onSubmit({
      username,
      email,
      password,
      phoneNumber,
      companyName,
    })
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[70%]'>
        <DialogHeader>
          <DialogTitle>Add Admin</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='firstName'>First Name</Label>
            <Input
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Username'
            />
          </div>
          <div>
            <Label htmlFor='lastName'>Last Name</Label>
            <Input
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
            />
          </div>
          <div>
            <Label htmlFor='email'>Password</Label>
            <Input
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
            />
          </div>
          <div>
            <Label htmlFor='companyName'>Password</Label>
            <Input
              id='companyName'
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder='Company Name'
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
          <Button
            onClick={handleSubmit}
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
