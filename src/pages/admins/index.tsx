import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { UserNav } from '@/components/user-nav'
import { useAppDispatch, useAppSelector } from '@/data/redux/hooks'
import {
  addProfile,
  addProfiles,
  selectProfiles,
} from '@/data/redux/slices/profiles'
import useLocalStorage from '@/hooks/use-local-storage'
import { Profile } from '@/model'
import api, { RequestError } from '@/services/api'
import 'leaflet/dist/leaflet.css'
import { PlusIcon } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import AddProfileModal from './components/AddProfileModal.tsx'
import { columns } from './components/columns.tsx'
import { DataTable } from './components/data-table.tsx'

export default function Profiles() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })
  const profiles = useAppSelector(selectProfiles)
  const [requesting, setRequesting] = useState(false)
  const [isAddProfileModalOpen, setAddProfileModalOpen] = useState(false)

  async function fetchProfiles() {
    try {
      setRequesting(true)
      const response = await api.getUsers({
        page: 1,
        limit: 10,
        apiAccessToken: String(apiAccessToken),
      })
      if (response.ok) {
        const result = (await response.json()) as {
          count: number
          atOffset: number
          data: Array<Profile>
        }
        dispatch(addProfiles(result.data))
        console.log(profiles)
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
          <ToastAction altText='Try again' onClick={() => fetchProfiles()}>
            Try again
          </ToastAction>
        ),
      })
    } finally {
      setRequesting(false)
    }
  }
  console.log(profiles)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const handleAddProfile = async (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber: string
  }) => {
    try {
      const response = await api.createAdminProfile({
        apiAccessToken: String(apiAccessToken),
        profileData: data,
      })

      if (response.ok) {
        const result = await response.json()
        console.log(result)
        dispatch(addProfile(result.data))
        toast({
          title: 'Profile Added',
          description: 'The profile has been added successfully!',
          variant: 'default',
        })
      } else {
        const error = (await response.json()).error
        toast({
          title: 'Error Adding Profile',
          description: error.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error adding profile:', error)
      toast({
        title: 'Request Failed',
        description: 'Check your network connection!',
        variant: 'destructive',
      })
    } finally {
      setAddProfileModalOpen(false)
    }
  }

  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Admins</h2>
            <p className='mb-4 text-muted-foreground'>
              Admins that manage application
            </p>
          </div>
          <Button
            onClick={() => setAddProfileModalOpen(true)}
            className='font-semibold'
          >
            <PlusIcon size={18} className='mr-2' />
            Add Admin
          </Button>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={
              Object.values(profiles)
                .filter((v) => v.role === 'ADMIN')
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((v) => ({
                  id: v.id,
                  name: v.firstName + ' ' + v.lastName,
                  phoneNumber: v.phoneNumber,
                  createdAt: moment(v.createdAt).format('ddd DD, MMM YYYY'),
                  email: v.email,
                })) as any
            }
            columns={columns}
            onFetch={() => fetchProfiles()}
            fetching={requesting}
          />
        </div>

        <AddProfileModal
          isOpen={isAddProfileModalOpen}
          onClose={() => setAddProfileModalOpen(false)}
          onSubmit={handleAddProfile}
        />
      </LayoutBody>
    </Layout>
  )
}
