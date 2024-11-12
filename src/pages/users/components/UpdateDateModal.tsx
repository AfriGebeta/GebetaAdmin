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

interface UpdateDateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { purchased_date: string }) => void
  profileData: {
    purchased_date: string
  }
}

const UpdateDateModal: React.FC<UpdateDateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  profileData,
}) => {
  const [date, setDate] = useState('')

  const [loading, setLoading] = useState(false)
  console.log('profile data', profileData.purchased_date)
  useEffect(() => {
    setDate(profileData.purchased_date)
  }, [profileData])

  const handleSubmit = async () => {
    setLoading(true)
    console.log('submitting', loading)
    await onSubmit({
      purchased_date: date,
    })
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[50%]'>
        <DialogHeader>
          <DialogTitle>Update Purchased Date</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className='flex w-full flex-col items-center '>
            <video autoPlay loop src={mapLoader} />
            <h3 className=''>Updating profile...</h3>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='space-y-1'>
              <Label htmlFor='date'>Purchased Date</Label>
              <Input
                id='date'
                value={date}
                type='date'
                className='w-fit'
                onChange={(e) => setDate(e.target.value)}
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

export default UpdateDateModal
