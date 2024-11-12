//@ts-nocheck
import { Place } from '@/model'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Place>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <p>{row.original?.name}</p>
    },
  },
  {
    accessorKey: 'city',
    header: 'City',
    cell: ({ row }) => {
      return <p className='whitespace-nowrap'>{row.original?.city}</p>
    },
  },
  {
    accessorKey: 'country',
    header: 'Country',
    cell: ({ row }) => {
      return <p>{row.original?.country}</p>
    },
  },
  {
    accessorKey: 'longitude',
    header: 'Longitude',
    cell: ({ row }) => {
      return <p>{row.original?.longitude}</p>
    },
  },
  {
    accessorKey: 'latitude',
    header: 'Latitude',
    cell: ({ row }) => {
      return <p>{row.original?.latitude}</p>
    },
  },
  // {
  //   accessorKey: 'ownedBy',
  //   header: 'Owned By',
  //   cell: ({ row }) => {
  //     return <p>{row.original?.ownedBy}</p>
  //   },
  // },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      return <p>{row.original?.type}</p>
    },
  },
]
