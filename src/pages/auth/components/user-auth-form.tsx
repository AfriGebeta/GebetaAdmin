//@ts-nocheck
import { HTMLAttributes, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
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
import useLocalStorage from '@/hooks/use-local-storage.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { ToastAction } from '@/components/ui/toast.tsx'
import { AuthContext } from '@/contexts'
import api, { RequestError } from '@/services/api.ts'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {
  hasSocialSignIn: boolean
}

const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, { message: 'Please enter your phone number' })
    .min(9, { message: 'Phone number must be 9 characters long' })
    .max(9, { message: 'Phone number must be 9 characters long' })
    .regex(/^\(?\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/g, 'Invalid phone number!'),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(6, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({
  className,
  hasSocialSignIn = false,
  ...props
}: UserAuthFormProps) {
  const authContext = useContext(AuthContext)
  const { toast } = useToast()
  // const navigate = useNavigate()

  const [_, setCurrentProfile] = useLocalStorage<Profile | null>({
    key: 'currentProfile',
    defaultValue: null,
  })

  const [__, setApiAccessToken] = useLocalStorage<string | null>({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const response = await api.signIn(data)

      if (response.status === 201) {
        const responseData = (await response.json()).data as {
          token: string
          user: Profile
        }

        const profile = responseData.user
        const accessToken = responseData.token

        console.log({ responseData })

        setCurrentProfile({ ...profile })
        setApiAccessToken(accessToken)

        const toastControl = toast({
          title: `Success`,
          description: `Logged in!`,
        })

        setTimeout(() => {
          toastControl.dismiss()
          authContext.setSignedIn(true)
        }, 500)
      } else {
        const responseData = (await response.json()).error as RequestError

        toast({
          title: `${responseData.namespace}/${responseData.code}`,
          description: responseData.message,
          variant: 'destructive',
        })
      }
    } catch (e) {
      console.error(e)
      toast({
        title: 'Request Failed',
        description: 'Check your network connection!',
        variant: 'destructive',
        action: (
          <ToastAction
            altText='Try again'
            onClick={() => {
              onSubmit(data)
            }}
          >
            Try again
          </ToastAction>
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
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
            </div>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Login
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
