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

interface EditPlaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    city: string
    country: string
    longitude: string
    latitude: string
    ownedBy: string
    type: string
  }) => void
  placeData: {
    name: string
    city: string
    country: string
    longitude: string
    latitude: string
    ownedBy: string
    type: string
  }
}

const EditPlaceModal: React.FC<EditPlaceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  placeData,
}) => {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [longitude, setLongitude] = useState(0)
  const [latitude, setLatitude] = useState(0)
  const [ownedBy, setOwnedBy] = useState('')
  const [type, setType] = useState('')

  const [loading, setLoading] = useState(false)
  console.log('profle data', placeData)
  useEffect(() => {
    setName(placeData.name)
    setCity(placeData.city)
    setCountry(placeData.country)
    setLongitude(placeData.longitude)
    setLatitude(placeData.latitude)
    setOwnedBy(placeData.ownedBy)
    setType(placeData.type)
  }, [placeData])

  const handleSubmit = async () => {
    setLoading(true)
    console.log('submitting', loading)
    await onSubmit({
      name,
      city,
      country,
      longitude,
      latitude,
      ownedBy,
      type,
    })
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[90%]'>
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
              <Label htmlFor='city'>City</Label>
              <Input
                id='city'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder='City'
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='country'>Country</Label>
              <Input
                id='country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder='Country'
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='longitude'>Longitude</Label>
              <Input
                id='longitude'
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder='Longitude'
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='latitude'>Latitude</Label>
              <Input
                id='latitude'
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder='Latitude'
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='ownedBy'>Owned By</Label>
              <Input
                id='ownedBy'
                value={ownedBy}
                onChange={(e) => setOwnedBy(e.target.value)}
                placeholder='Owned By'
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='type'>Type</Label>
              <Input
                id='type'
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder='Type'
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

export default EditPlaceModal
