import { Card } from '@/components/ui/card'
import { SignUpForm } from './components/sign-up-form'
import { Link } from 'react-router-dom'
import logo from '@/assets/logo.svg'

export interface SignUpProps {
  hasSocialSignIn: boolean
  showAgreementLine: boolean
}

export default function SignUp({
  hasSocialSignIn = false,
  showAgreementLine = false,
}: SignUpProps) {
  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <img src={logo} className='relative mr-2 h-6 w-6' alt='Logo' />
            <h1 className='text-xl font-medium'>Data Horde Admin</h1>
          </div>
          <Card className='p-6'>
            <div className='mb-2 flex flex-col space-y-2 text-left'>
              <h1 className='text-lg font-semibold tracking-tight'>
                Create an account
              </h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email and password to create an account. <br />
                Already have an account?{' '}
                <Link
                  to='/sign-in'
                  className='underline underline-offset-4 hover:text-primary'
                >
                  Sign In
                </Link>
              </p>
            </div>
            <SignUpForm hasSocialSignIn={hasSocialSignIn} />

            {showAgreementLine && (
              <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
                By creating an account, you agree to our{' '}
                <a
                  href='/terms'
                  className='underline underline-offset-4 hover:text-primary'
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href='/privacy'
                  className='underline underline-offset-4 hover:text-primary'
                >
                  Privacy Policy
                </a>
                .
              </p>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
