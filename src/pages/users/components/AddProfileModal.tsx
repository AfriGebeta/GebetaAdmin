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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface AddProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    username: string
    password: string
    companyname?: string
    firstname?: string
    lastname?: string
    email: string
    phone: string
    is_organization: boolean
  }) => void
}

const AddProfileModal: React.FC<AddProfileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [accountType, setAccountType] = useState<'Business' | 'Individual'>(
    'Business'
  )
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    companyname: '',
    firstname: '',
    lastname: '',
  })

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))
    }

  const handleSubmit = () => {
    const submissionData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      is_organization: accountType === 'Business',
      ...(accountType === 'Business'
        ? {
            companyname: formData.companyname,
            firstname: '',
            lastname: '',
          }
        : {
            firstname: formData.firstname,
            lastname: formData.lastname,
            companyname: '',
          }),
    }
    onSubmit(submissionData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[80%] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <RadioGroup
            defaultValue='Business'
            onValueChange={(value) =>
              setAccountType(value as 'Business' | 'Individual')
            }
            className='flex flex-col space-y-1'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='Business' id='business' />
              <Label htmlFor='business'>
                Business - for your work, school or organization
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='Individual' id='individual' />
              <Label htmlFor='individual'>
                Individual - for your own projects
              </Label>
            </div>
          </RadioGroup>

          {accountType === 'Individual' && (
            <>
              <div className='space-y-2'>
                <Label htmlFor='firstname'>First Name</Label>
                <Input
                  id='firstname'
                  value={formData.firstname}
                  onChange={handleInputChange('firstname')}
                  placeholder='First Name'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastname'>Last Name</Label>
                <Input
                  id='lastname'
                  value={formData.lastname}
                  onChange={handleInputChange('lastname')}
                  placeholder='Last Name'
                />
              </div>
            </>
          )}

          {accountType === 'Business' && (
            <div className='space-y-2'>
              <Label htmlFor='companyName'>Organization Name</Label>
              <Input
                id='companyName'
                value={formData.companyname}
                onChange={handleInputChange('companyname')}
                placeholder='Organization Name'
              />
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='username'>Username</Label>
            <Input
              id='username'
              value={formData.username}
              onChange={handleInputChange('username')}
              placeholder='Username'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder='Email'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              value={formData.password}
              onChange={handleInputChange('password')}
              placeholder='Password'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='phoneNumber'>Phone Number</Label>
            <Input
              id='phoneNumber'
              value={formData.phone}
              onChange={handleInputChange('phone')}
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
