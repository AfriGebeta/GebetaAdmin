//@ts-nocheck
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '../components/data-table-view-options'
import { statuses, types } from '../data/data'

import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { useEffect, useState } from 'react'
import useLocalStorage from '@/hooks/use-local-storage.tsx'
import api, { RequestError } from '@/services/api.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { EyeOffIcon, PenIcon, TestTube2Icon, VerifiedIcon } from 'lucide-react'
import { IconFidgetSpinner } from '@tabler/icons-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner.tsx'
import { toast } from '@/components/ui/use-toast.ts'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onSearch: (searchTerm: string) => Promise<void>
}

export function DataTableToolbar<TData>({
  table,
  onSearch,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [searchTerm, setSearchTerm] = useState('')

  const [profiles, setProfiles] = useState([])

  const selectedPlaceId = table.getSelectedRowModel().rows[0]?.original.id

  const selectedPlacesIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id)

  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const navigate = useNavigate()

  const [transition, setTransition] = useState(false)

  const [approving, setApproving] = useState(false)
  const [togglingTest, setTogglingTest] = useState(false)
  const [togglingHidden, setTogglingHidden] = useState(false)

  const handleSearch = () => {
    onSearch(searchTerm)
  }

  async function fetchProfiles() {
    try {
      const response = await api.getProfiles({ apiAccessToken })
      const data = await response.json()

      console.log('bro', data)
      setProfiles(
        data.data.map((profile: any) => ({
          label: `${profile.firstName} ${profile.lastName}`,
          value: profile.id,
        }))
      )
    } catch (error) {
      console.error('Failed to fetch profiles:', error)
    }
  }

  useEffect(() => {
    const id = setTimeout(() => {
      fetchProfiles()
    }, 1)

    return () => clearTimeout(id)
  }, [])

  const handleApprovePlaces = async () => {
    try {
      console.log('selectedPlacesIds', selectedPlacesIds)
      setApproving(true)
      const response = await api.approvePlace({
        apiAccessToken: String(apiAccessToken),
        ids: selectedPlacesIds,
      })

      if (response.ok) {
        toast({
          title: 'Succefully approved places',
          description: 'The selected places have been approved',
        })
      } else {
        const responseData = (await response.json()).error as RequestError

        toast({
          title: `${responseData.namespace}/${responseData.code}`,
          description: responseData.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      setApproving(false)
      console.error('Failed to approve place:', error)
    } finally {
      setApproving(false)
    }
  }

  const handleToggleHiddenPlaces = async () => {
    try {
      setTogglingHidden(true)
      const response = await api.togglePlacesToHidden({
        apiAccessToken: String(apiAccessToken),
        ids: selectedPlacesIds,
      })

      if (response.ok) {
        toast({
          title: 'Succefully approved places',
          description: 'The selected places have been approved',
        })
      } else {
        const responseData = (await response.json()).error as RequestError

        toast({
          title: `${responseData.namespace}/${responseData.code}`,
          description: responseData.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      setTogglingHidden(false)
      console.error('Failed to approve place:', error)
    } finally {
      setTogglingHidden(false)
    }
  }
  const handleToggleTestPlaces = async () => {
    try {
      setTogglingTest(true)
      const response = await api.togglePlacesToTest({
        apiAccessToken: String(apiAccessToken),
        ids: selectedPlacesIds,
      })

      if (response.ok) {
        toast({
          title: 'Succefully approved places',
          description: 'The selected places have been approved',
        })
      } else {
        const responseData = (await response.json()).error as RequestError

        toast({
          title: `${responseData.namespace}/${responseData.code}`,
          description: responseData.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      setTogglingHidden(false)
      console.error('Failed to approve place:', error)
    } finally {
      setTogglingTest(false)
    }
  }

  useEffect(() => {
    setTransition(true)
    const timeout = setTimeout(() => setTransition(false), 300)
    return () => clearTimeout(timeout)
  }, [table.getIsSomeRowsSelected()])

  return (
    <div
      className={`flex items-center justify-between transition-all duration-300 ${transition ? 'opacity-50' : 'opacity-100'}`}
    >
      {!table.getIsSomeRowsSelected() ? (
        <>
          <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
            <Input
              placeholder='Filter places...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-8 w-[150px] lg:w-[250px]'
            />
            <Button onClick={handleSearch}>Search</Button>
            <div className='flex gap-x-2'>
              {table.getColumn('status') && (
                <DataTableFacetedFilter
                  column={table.getColumn('status')}
                  title='Status'
                  options={statuses}
                />
              )}
              {table.getColumn('type') && (
                <DataTableFacetedFilter
                  column={table.getColumn('type')}
                  title='Place Type'
                  options={types}
                />
              )}
              {table.getColumn('addedById') && profiles.length > 0 && (
                <DataTableFacetedFilter
                  column={table.getColumn('addedById')}
                  title='Collector'
                  options={profiles}
                />
              )}
            </div>
            {isFiltered && (
              <Button
                variant='ghost'
                onClick={() => table.resetColumnFilters()}
                className='h-8 px-2 lg:px-3'
              >
                Reset
                <Cross2Icon className='ml-2 h-4 w-4' />
              </Button>
            )}
          </div>
          <DataTableViewOptions table={table} />
        </>
      ) : (
        <div className='flex w-full gap-4'>
          <Button
            variant='outline'
            disabled={table.getSelectedRowModel().rows.length > 1}
            onClick={() => navigate(`/places/${selectedPlaceId}/edit`)}
          >
            <PenIcon size={12} className='mr-2' />
            Edit
          </Button>
          <Button
            variant='outline'
            onClick={handleApprovePlaces}
            disabled={approving}
          >
            {!approving ? (
              <>
                <VerifiedIcon size={12} className='mr-2' />
                Approve
              </>
            ) : (
              <LoadingSpinner className='h-5 w-5' />
            )}
          </Button>
          <Button
            variant='outline'
            onClick={handleToggleHiddenPlaces}
            disabled={togglingHidden}
          >
            {!togglingHidden ? (
              <>
                <EyeOffIcon size={12} className='mr-2' />
                Hide
              </>
            ) : (
              <LoadingSpinner className='h-5 w-5' />
            )}
          </Button>
          <Button
            variant='outline'
            onClick={handleToggleTestPlaces}
            disabled={togglingTest}
          >
            {!togglingTest ? (
              <>
                <TestTube2Icon size={12} className='mr-2' />
                Test
              </>
            ) : (
              <LoadingSpinner className='h-5 w-5' />
            )}
          </Button>
          <Button
            variant='ghost'
            onClick={() => table.resetRowSelection()}
            className=''
          >
            Unselect
          </Button>
        </div>
      )}
    </div>
  )
}
