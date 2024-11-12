//@ts-nocheck
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import api from '@/services/api'
import { toast } from '@/components/ui/use-toast.ts'
import moment from 'moment'

interface ShowUsageModalProps {
  isOpen: boolean
  onClose: () => void
  selectedProfile: { id: string } | null
  apiAccessToken: string
}

const ShowUsageModal: React.FC<ShowUsageModalProps> = ({
  isOpen,
  onClose,
  selectedProfile,
  apiAccessToken,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [totalUsage, setTotalUsage] = useState<number | null>(null)
  const [totalSale, setTotalSale] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleShowUsage = async () => {
    if (selectedProfile && startDate && endDate) {
      const formattedStartDate = moment(startDate).format('YYYY-MM-DD')
      const formattedEndDate = moment(endDate)
        .add(1, 'days')
        .format('YYYY-MM-DD')

      try {
        setLoading(true)
        const response = await api.getUsage({
          apiAccessToken: String(apiAccessToken),
          id: selectedProfile.id,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        })

        if (response.ok) {
          setLoading(false)
          const data = await response.json()
          const total = data.data.reduce(
            (sum: number, item: { Total: number }) => sum + item.Total,
            0
          )
          setTotalUsage(total)
          setTotalSale(total * 0.02)
        } else {
          setLoading(false)
          const error = await response.json()
          toast({
            title: 'Error Showing Usage',
            description: error.message,
            variant: 'destructive',
          })
        }
      } catch (error) {
        setLoading(false)
        console.error(error)
        toast({
          title: 'Request Failed',
          description: 'Check your network connection!',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setStartDate(null)
    setEndDate(null)
    setTotalUsage(null)
    setTotalSale(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='h-[80%] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Show Usage</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className='w-full justify-start text-left'
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className='space-y-2'>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className='w-full justify-start text-left'
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            onClick={handleShowUsage}
            className='bg-[#ffa818] font-semibold text-white'
          >
            {loading ? 'Calculating ...' : 'Show Usage'}
          </Button>
          {totalUsage !== null && (
            <div className='mt-4 rounded-md border border-gray-300 bg-gray-50 p-4'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Usage Summary
              </h3>
              <div className='mt-2 flex justify-between'>
                <span className='text-sm text-gray-600'>Total Usage:</span>
                <span className='text-lg font-bold text-blue-600'>
                  {totalUsage}
                </span>
              </div>
              <div className='mt-1 flex justify-between'>
                <span className='text-sm text-gray-600'>Total Sale:</span>
                <span className='text-lg font-bold text-green-600'>
                  ${totalSale?.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShowUsageModal
