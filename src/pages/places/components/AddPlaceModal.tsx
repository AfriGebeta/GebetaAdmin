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

interface AddPlaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    city: string
    country: string
    lon: string
    lat: string
    type: string
  }) => void
}

const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [lon, setLongitude] = useState(0)
  const [lat, setLatitude] = useState(0)
  const [type, setType] = useState('')

  const [loading, setLoading] = useState(false)

  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const handleSubmit = async () => {
    setLoading(true)

    await onSubmit({
      name,
      city,
      country,
      lon,
      lat,
      type,
    })
    setLoading(false)
  }

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setCity('')
      setCountry('')
      setLongitude(0)
      setLatitude(0)
      setType('')
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[90%]'>
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
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Name'
              />
            </div>
            <div>
              <Label htmlFor='city'>City</Label>
              <Input
                id='city'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder='City'
              />
            </div>
            <div>
              <Label htmlFor='country'>Country</Label>
              <Input
                id='country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder='Country'
              />
            </div>
            <div>
              <Label htmlFor='longitude'>Longitude</Label>
              <Input
                id='longitude'
                value={lon}
                onChange={(e) => setLongitude(Number(e.target.value))}
                placeholder='Longitude'
              />
            </div>
            <div>
              <Label htmlFor='latitude'>Latitude</Label>
              <Input
                id='latitude'
                value={lat}
                onChange={(e) => setLatitude(Number(e.target.value))}
                placeholder='Latitude'
              />
            </div>
            <div>
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
            >
              Submit
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddPlaceModal
