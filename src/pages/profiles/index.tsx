//@ts-nocheck
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
  updateProfileActivation,
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

import EditProfileModal from './components/EditProfileModal.tsx'
import DeleteProfileModal from './components/DeleteProfileModal.tsx'

export default function Profiles() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })
  const profiles = useAppSelector(selectProfiles)
  const [requesting, setRequesting] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isMapModalOpen, setMapModalOpen] = useState(false)
  const [isAddProfileModalOpen, setAddProfileModalOpen] = useState(false)
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false)
  const [isDeleteProfileModalOpen, setDeleteProfileModalOpen] = useState(false)
  setDeleteProfileModalOpen

  async function fetchProfiles() {
    try {
      setRequesting(true)
      const response = await api.getProfiles({
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

  const handleShowMap = (profile: Profile) => {
    setSelectedProfile(profile)
    setMapModalOpen(true)
  }

  const handleToggleActivation = async (id: string, isActive: boolean) => {
    try {
      let response

      if (isActive) {
        response = await api.deactivateProfile({
          apiAccessToken: String(apiAccessToken),
          id,
        })
      } else {
        response = await api.activateProfile({
          apiAccessToken: String(apiAccessToken),
          id,
        })
      }

      if (response.ok) {
        dispatch(updateProfileActivation({ id, isActive: !isActive }))
        toast({
          title: 'Profile Updated',
          description: isActive
            ? 'Profile deactivated successfully!'
            : 'Profile activated successfully!',
          variant: 'default',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error Toggling Profile',
          description: error.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error toggling activation:', error)
      toast({
        title: 'Request Failed',
        description: 'Check your network connection!',
        variant: 'destructive',
      })
    }
  }

  const handleAddProfile = async (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber: string
    collectionBoundary: { latitude: string; longitude: string }[]
  }) => {
    try {
      const response = await api.createProfile({
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

  const handleEditProfile = (profile: Profile) => {
    setSelectedProfile(profile)
    setEditProfileModalOpen(true)
  }

  const handleDeleteProfile = (profile: Profile) => {
    setSelectedProfile(profile)
    setDeleteProfileModalOpen(true)
  }

  const handleDeleteProfile2 = async (id: string) => {
    if (selectedProfile) {
      const selectedId = selectedProfile.id
      try {
        console.log(`zuzu : ${selectedId}`)
        await api.deleteProfile({ apiAccessToken, selectedId })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleUpdateProfile = async (data: {
    firstName: string
    lastName: string
    email: string
    collectionBoundary: { bounds: string[] }
  }) => {
    if (selectedProfile) {
      try {
        console.log('Updating profile with ID:', selectedProfile.id)
        console.log('Payload:', {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          collectionBoundary: data.collectionBoundary,
        })

        const response = await api.updateProfile({
          apiAccessToken: String(apiAccessToken),
          id: selectedProfile.id,
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: selectedProfile.phoneNumber,
            email: data.email,
            active: selectedProfile.active,
            collectionBoundary: data.collectionBoundary,
          },
        })

        console.log('Response status:', response.status)
        if (response.ok) {
          toast({
            title: 'Profile Updated',
            description: 'The profile has been updated successfully!',
            variant: 'default',
          })
          fetchProfiles()
        } else {
          const error = await response.json()
          console.error('Update error:', error)
          toast({
            title: 'Error Updating Profile',
            description: error.message,
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Error updating profile:', error)
        toast({
          title: 'Request Failed',
          description: 'Check your network connection!',
          variant: 'destructive',
        })
      } finally {
        setEditProfileModalOpen(false)
      }
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
            <h2 className='text-2xl font-bold tracking-tight'>Collectors</h2>
            <p className='mb-4 text-muted-foreground'>
              Profiles managed by the application
            </p>
          </div>
          <Button onClick={() => setAddProfileModalOpen(true)}>
            <PlusIcon size={18} className='mr-2' />
            Add Collector
          </Button>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={
              Object.values(profiles)
                .filter((v) => v.role === 'COLLECTOR')
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
                  role: v.role,
                  collectionBoundary: v.collectionBoundary,
                  active: v.active,
                })) as any
            }
            columns={columns}
            onFetch={() => fetchProfiles()}
            fetching={requesting}
            onToggleActivation={handleToggleActivation}
            onEdit={handleEditProfile}
            onDelete={handleDeleteProfile}
          />
        </div>

        <AddProfileModal
          isOpen={isAddProfileModalOpen}
          onClose={() => setAddProfileModalOpen(false)}
          onSubmit={handleAddProfile}
        />

        {selectedProfile && (
          <EditProfileModal
            profileData={selectedProfile}
            isOpen={isEditProfileModalOpen}
            onClose={() => setEditProfileModalOpen(false)}
            onSubmit={handleUpdateProfile}
          />
        )}
        {selectedProfile && (
          <DeleteProfileModal
            id={selectProfiles.id}
            isOpen={isDeleteProfileModalOpen}
            onClose={() => setDeleteProfileModalOpen(false)}
            onSubmit={handleDeleteProfile2}
          />
        )}
      </LayoutBody>
    </Layout>
  )
}
