import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {
  hasSocialSignIn: boolean
}

const formSchema = z
  .object({
    phoneNumber: z
      .string()
      .min(1, { message: 'Please enter your phone number' })
      .min(9, { message: 'Phone number must be at least 9 characters long' })
      .max(9, { message: 'Phone number must be at least 9 characters long' })
      .regex(/^\(?\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/g, 'Invalid phone number'),
    password: z
      .string()
      .min(1, {
        message: 'Please enter your password',
      })
      .min(6, {
        message: 'Password must be at least 7 characters long',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  hasSocialSignIn = false,
  ...props
}: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    console.log(data)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className='flex items-center'>
                      <p className='p-2 text-sm text-gray-400'>+251</p>
                      <Input
                        type='tel'
                        placeholder='- -  - - -  - - - -'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Create Account
            </Button>

            {hasSocialSignIn && (
              <>
                <div className='relative my-2'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background px-2 text-muted-foreground'>
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    className='w-full'
                    type='button'
                    loading={isLoading}
                    leftSection={<IconBrandGithub className='h-4 w-4' />}
                  >
                    GitHub
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full'
                    type='button'
                    loading={isLoading}
                    leftSection={<IconBrandFacebook className='h-4 w-4' />}
                  >
                    Facebook
                  </Button>
                </div>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
