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
import { Checkbox } from '@/components/ui/checkbox'
import mapLoader from '/animation.webm'
import useLocalStorage from '@/hooks/use-local-storage.tsx'

interface AddBundleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    price: number
    rate: number
    expirationDate: string
    callCaps: number[]
    includedCallTypes: string[]
    expiredIn: number
  }) => void
}

const callTypes = ['DIRECTION', 'GEOCODING', 'MATRIX', 'ONM', 'TSS']

const AddBundleModal: React.FC<AddBundleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [rate, setRate] = useState(0)
  const [expirationDate, setExpirationDate] = useState('')
  const [callCaps, setCallCaps] = useState([0, 0, 0, 0, 0])
  const [includedCallTypes, setIncludedCallTypes] = useState([])
  const [expiredIn, setExpiredIn] = useState(0)

  const [loading, setLoading] = useState(false)

  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const handleSubmit = async () => {
    setLoading(true)
    await onSubmit({
      name,
      price,
      rate,
      expirationDate,
      callCaps,
      includedCallTypes,
      expiredIn,
    })
    setLoading(false)
  }

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setPrice(0)
      setRate(0)
      setExpirationDate('')
      setCallCaps([0, 0, 0, 0, 0])
      setIncludedCallTypes([])
      setExpiredIn(30)
    }
  }, [isOpen])

  const handleCheckboxChange = (callType) => {
    setIncludedCallTypes((prev) =>
      prev.includes(callType)
        ? prev.filter((type) => type !== callType)
        : [...prev, callType]
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[90%] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add Bundle</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className='flex w-full flex-col items-center'>
            <video autoPlay loop src={mapLoader} />
            <p>Adding bundle...</p>
          </div>
        ) : (
          <div className='space-y-6'>
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter Package'
              />
            </div>
            <div>
              <Label htmlFor='price'>Price</Label>
              <Input
                id='price'
                type='number'
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                placeholder='Premium Package'
              />
            </div>
            <div>
              <Label htmlFor='rate'>Rate</Label>
              <Input
                id='rate'
                type='number'
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                placeholder='0.3'
              />
            </div>
            <div>
              <Label htmlFor='expiration'>Expiration Date</Label>
              <Input
                id='expiration'
                type='date'
                value={expirationDate}
                className='w-fit'
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label>Included Call Types</Label>
              <div className='mt-2 flex flex-col flex-wrap gap-2'>
                {callTypes.map((type) => (
                  <div key={type} className='flex items-center space-x-2'>
                    <Checkbox
                      id={type}
                      checked={includedCallTypes.includes(type)}
                      onCheckedChange={() => handleCheckboxChange(type)}
                    />
                    <Label className='text-xs' htmlFor={type}>
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Call Caps</Label>
              <div className='mt-2 grid grid-cols-2 gap-4'>
                {callTypes.map((type, index) => (
                  <div key={type}>
                    <Label className='text-xs' htmlFor={`callCap-${type}`}>
                      {type}
                    </Label>
                    <Input
                      id={`callCap-${type}`}
                      type='number'
                      disabled={!includedCallTypes.includes(type)}
                      value={callCaps[index]}
                      onChange={(e) => {
                        const newCallCaps = [...callCaps]
                        newCallCaps[index] = parseInt(e.target.value)
                        setCallCaps(newCallCaps)
                      }}
                      placeholder='10'
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor='expiredIn'>Expired In (days)</Label>
              <Input
                id='expiredIn'
                type='number'
                value={expiredIn}
                onChange={(e) => setExpiredIn(parseInt(e.target.value))}
                placeholder='30'
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

export default AddBundleModal
