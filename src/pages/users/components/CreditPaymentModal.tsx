//@ts-nocheck
import { useGetPlans } from '@/hooks/useGetPlans.ts'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Loader from '@/components/loader'

interface CreditPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    payment_method: string
    payment_for: string
    credit_bundle_id: string
  }) => void
}

const formSchema = z.object({
  payment_method: z.string().min(1, 'Payment method is required'),
  payment_for: z.string(),
  credit_bundle_id: z.string().min(1, 'Credit bundle is required'),
})

const CreditPaymentModal: React.FC<CreditPaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { data, isLoading } = useGetPlans()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: '',
      payment_for: 'credit', // Set default value to "credit"
      credit_bundle_id: '',
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[50%] max-w-md'>
        <DialogHeader>
          <DialogTitle>Buy Package</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className='flex h-24 items-center justify-center'>
            <Loader />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='credit_bundle_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a package' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data?.credit_bundles.map((bundle) => (
                          <SelectItem key={bundle.id} value={bundle.id}>
                            {bundle.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='payment_method'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select payment method' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='CASH'>Cash</SelectItem>
                        <SelectItem value='BANK_TRANSFER'>
                          Bank Transfer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type='submit' className='w-full sm:w-auto'>
                  Buy
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreditPaymentModal
