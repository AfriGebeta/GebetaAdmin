//@ts-nocheck
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useLocalStorage from '@/hooks/use-local-storage.tsx'
import { useContext } from 'react'
import { AuthContext } from '@/contexts'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api.ts'

export function UserNav() {
  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const [currentProfile, _] = useLocalStorage({
    key: 'currentProfile',
    defaultValue: null,
  })
  const [apiAccessToken, setApiAccessToken] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
            <AvatarFallback>
              {`${String(currentProfile?.firstName)[0]}${
                currentProfile?.lastName
                  ? String(currentProfile?.lastName)[0]
                  : ''
              }`}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {`${currentProfile?.firstName}${
                currentProfile?.lastName ? ` ${currentProfile?.lastName}` : ''
              }`}
            </p>

            {currentProfile?.email && (
              <p className='text-xs leading-none text-muted-foreground'>
                {currentProfile.email}
              </p>
            )}

            {currentProfile?.phoneNumber && (
              <p className='text-xs leading-none text-muted-foreground'>
                {currentProfile.phoneNumber}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/*<DropdownMenuItem>*/}
          {/*Profile*/}
          {/*  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
          {/*</DropdownMenuItem>*/}
          {/*<DropdownMenuItem>*/}
          {/*  Billing*/}
          {/*  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>*/}
          {/*</DropdownMenuItem>*/}
          {/*<DropdownMenuItem onClick={() => navigate('/settings')}>*/}
          {/*  Settings*/}
          {/*  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>*/}
          {/*</DropdownMenuItem>*/}
          {/*<DropdownMenuItem>New Team</DropdownMenuItem>*/}
        </DropdownMenuGroup>
        {/*<DropdownMenuSeparator />*/}
        <DropdownMenuItem
          onClick={async () => {
            try {
              await api.logout(apiAccessToken)
            } catch (e) {
              console.error(e)
            } finally {
              setApiAccessToken(null)
              authContext.setSignedIn(false)
            }
          }}
        >
          Log out
          {/*<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>*/}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
