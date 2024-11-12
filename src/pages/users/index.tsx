//@ts-nocheck
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { UserNav } from '@/components/user-nav'
import { useAppDispatch, useAppSelector } from '@/data/redux/hooks'
import { selectProfiles } from '@/data/redux/slices/profiles'
import useLocalStorage from '@/hooks/use-local-storage'
import { Profile } from '@/model'
import api, { RequestError } from '@/services/api'
import 'leaflet/dist/leaflet.css'
import moment from 'moment'
import { useEffect, useState, useRef } from 'react'
import AddProfileModal from './components/AddProfileModal.tsx'
import { columns } from './components/columns.tsx'
import { DataTable } from './components/data-table.tsx'

import EditProfileModal from './components/EditProfileModal.tsx'
import DeleteProfileModal from './components/DeleteProfileModal.tsx'
import { useQuery } from '@tanstack/react-query'
import ResetPasswordModal from '@/pages/users/components/ResetPasswordModal.tsx'
import ShowUsageModal from '@/pages/users/components/ShowUsageModal.tsx'

export default function Users() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const [requesting, setRequesting] = useState(false)

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false)
  const [isResetPasswordModalOpen, setResetPasswordModalOpen] = useState(false)
  const [isShowUsageModalOpen, setShowUsageModalOpen] = useState(false)
  const [isDeleteProfileModalOpen, setDeleteProfileModalOpen] = useState(false)
  const [isAddProfileModalOpen, setAddProfileModalOpen] = useState(false)

  const [count, setCount] = useState(0)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['users', pagination.pageIndex, pagination.pageSize],
    queryFn: () => fetchUsers(pagination.pageIndex + 1, pagination.pageSize),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  })

  async function fetchUsers(page, pageSize) {
    try {
      setRequesting(true)
      const response = await api.getUsers({
        apiAccessToken: String(apiAccessToken),
        page,
        limit: pageSize,
      })
      if (response.ok) {
        const result = (await response.json()) as {
          data: {
            count: number
            users: Array<Profile>
          }
        }
        setCount(result.data.count)
        console.log(result.data.users)
        return { users: result.data.users, count: result.data.count }
      } else {
        const responseData = (await response.json()).error as RequestError
        toast({
          title: `${responseData.namespace}/${responseData.code}`,
          description: responseData.message,
          variant: 'destructive',
        })
        throw new Error(responseData.message)
      }
    } catch (e) {
      toast({
        title: 'Request Failed',
        description: 'Check your network connection!',
        variant: 'destructive',
        action: (
          <ToastAction
            altText='Try again'
            onClick={() => fetchUsers(page, pageSize)}
          >
            Try again
          </ToastAction>
        ),
      })
      throw e
    } finally {
      setRequesting(false)
    }
  }

  const formatUserData = (profile: Profile) => ({
    id: profile.id,
    name: profile.username,
    phone: profile.phone !== 'null' ? profile.phone : '-',
    email: profile.email,
    purchased_date: profile.purchased_date
      ? moment(profile.purchased_date).format('DD/MM/YYYY')
      : '-',
  })

  const handleEditProfile = (profile: Profile) => {
    setSelectedProfile(profile)
    setEditProfileModalOpen(true)
  }

  const handleUpdateDate = (profile: Profile) => {
    setSelectedProfile(profile)
    handleUpdateDateProfile(profile)
  }

  const handleSetTokenUser = (profile: Profile) => {
    setSelectedProfile(profile)
    handleSetUserToken(profile)
  }

  const handleResetPasswordProfile = (profile: Profile) => {
    setSelectedProfile(profile)
    handleResetPassword(profile)
  }

  const handleShowUsageProfile = (profile: Profile) => {
    setSelectedProfile(profile)
    setShowUsageModalOpen(true)
  }

  const handleDeleteProfile = (profile: Profile) => {
    setSelectedProfile(profile)
    setDeleteProfileModalOpen(true)
  }

  const handleDeleteProfile2 = async (id: string) => {
    if (selectedProfile) {
      const selectedId = selectedProfile.id
      try {
        await api.deleteProfile({ apiAccessToken, selectedId })
        setDeleteProfileModalOpen(false)
      } catch (error) {
        toast({ title: 'Unsuccesfull Deleting profile' })
      }
    }
  }

  const handleResetPassword = async () => {
    if (selectedProfile) {
      try {
        const response = await api.resetPassword({
          apiAccessToken: String(apiAccessToken),
          id: selectedProfile.id,
        })

        if (response.ok) {
          toast({
            title: 'Reset Password',
            description: 'The password has been reseted successfully!',
            variant: 'default',
          })
        } else {
          const error = await response.json()
          toast({
            title: 'Error Reseting Password',
            description: error.message,
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.log(error)
        toast({
          title: 'Request Failed',
          description: 'Check your network connection!',
          variant: 'destructive',
        })
      } finally {
        setResetPasswordModalOpen(false)
      }
    }
  }

  const handleUpdateDateProfile = async (data: { purchased_date: string }) => {
    if (selectedProfile) {
      try {
        const response = await api.updatePurchasedDate({
          apiAccessToken: String(apiAccessToken),
          id: selectedProfile.id,
        })

        if (response.ok) {
          toast({
            title: 'Profile Updated',
            description: 'The profile has been updated successfully!',
            variant: 'default',
          })
        } else {
          const error = await response.json()
          toast({
            title: 'Error Updating Profile',
            description: error.message,
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.log(error)
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

  const handleUpdateProfile = async (data: {
    name: string
    email: string
    phone: string
  }) => {
    if (selectedProfile) {
      try {
        const response = await api.updateUser({
          apiAccessToken: String(apiAccessToken),
          id: selectedProfile.id,
          data: {
            name: data.name,
            email: data.email,
          },
        })

        if (response.ok) {
          toast({
            title: 'Profile Updated',
            description: 'The profile has been updated successfully!',
            variant: 'default',
          })
        } else {
          const error = await response.json()
          toast({
            title: 'Error Updating Profile',
            description: error.message,
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.log(error)
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

  const handleSetUserToken = async () => {
    if (selectedProfile) {
      try {
        const response = await api.setToken({
          apiAccessToken: String(apiAccessToken),
          id: selectedProfile.id,
        })

        if (response.ok) {
          toast({
            title: 'Profile Updated',
            description: 'The profile has been updated successfully!',
            variant: 'default',
          })
        } else {
          const error = await response.json()
          toast({
            title: 'Error Updating Profile',
            description: error.message,
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.log(error)
        toast({
          title: 'Request Failed',
          description: 'Check your network connection!',
          variant: 'destructive',
        })
      }
    }
  }

  const handleAddProfile = async (data: {
    username: string
    password: string
    companyname: string
    email: string
    phone: string
  }) => {
    try {
      console.log('sending data', data)
      const response = await api.createUser({
        apiAccessToken: String(apiAccessToken),
        profileData: data,
      })

      if (response.ok) {
        const result = await response.json()
        console.log(result)
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
        <div className='mb-2 flex justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Users</h2>
            <p className='mb-4 text-muted-foreground'>
              Users managed by the application
            </p>
          </div>
          <Button onClick={() => setAddProfileModalOpen(true)}>Add User</Button>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={data?.users?.map(formatUserData) || []}
            columns={columns}
            fetching={requesting}
            onEdit={handleEditProfile}
            onDelete={handleDeleteProfile}
            onSetToken={handleSetTokenUser}
            onUpdateDate={handleUpdateDate}
            onResetPassword={handleResetPasswordProfile}
            onShowUsage={handleShowUsageProfile}
            count={data?.count || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
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
          <ResetPasswordModal
            profileData={selectedProfile}
            isOpen={isResetPasswordModalOpen}
            onClose={() => setResetPasswordModalOpen(false)}
            onSubmit={handleResetPassword}
          />
        )}

        {selectedProfile && (
          <ShowUsageModal
            selectedProfile={selectedProfile}
            isOpen={isShowUsageModalOpen}
            onClose={() => setShowUsageModalOpen(false)}
            // onSubmit={handleShowUsage}
            apiAccessToken={apiAccessToken}
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
