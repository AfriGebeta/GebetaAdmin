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
import api from '@/services/api.ts'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onSearch: (searchTerm: string) => void
}

export function DataTableToolbar<TData>({
  table,
  onSearch,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [searchTerm, setSearchTerm] = useState('')

  const [profiles, setProfiles] = useState([])

  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const handleSearch = () => {
    onSearch(searchTerm)
  }

  useEffect(() => {
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

    fetchProfiles()
  }, [apiAccessToken])

  return (
    <div className='flex items-center justify-between'>
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
    </div>
  )
}
