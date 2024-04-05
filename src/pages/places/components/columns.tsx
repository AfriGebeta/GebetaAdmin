//@ts-nocheck
import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from './data-table-column-header'

import { statuses } from '../data/data'
import { Address, PlaceStatus, PlaceType, Profile } from '@/contexts'

export const columns: ColumnDef<{
  id: string
  type: PlaceType
  customType?: string
  latitude: bigint
  longitude: bigint
  name: string
  status: PlaceStatus
  addedBy: Profile
  createdAt: string
  images: Array<string>
  address: Address
}>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label='Select all'
  //       className='translate-y-[2px]'
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label='Select row'
  //       className='translate-y-[2px]'
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      return <div className='w-[80px]'>{row.original.name['EN' as any]}</div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      return (
        <div className='w-[80px]'>
          {row.original.type === PlaceType.OTHER
            ? row.original.customType ?? 'OTHER'
            : row.original.type}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'latitude',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Latitude' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>{Number(row.original.latitude)}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'longitude',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Longitude' />
    ),
    cell: ({ row }) => {
      return <div className='w-[80px]'>{Number(row.original.longitude)}</div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'addedBy',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Added By' />
    ),
    cell: ({ row }) => {
      const addedBy = row.original.addedBy

      if (!addedBy) return null

      return (
        <div className='flex w-[100px] items-center'>
          <span>{`${addedBy.firstName}${addedBy.lastName ? ` ${addedBy.lastName}` : ''}`}</span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
    // filterFn: (row, id, value) => {
    //   return value.includes(row.original.addedBy)
    // },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt

      if (!createdAt) {
        return null
      }

      return (
        <div className='flex w-[100px] items-center'>
          <span>{createdAt}</span>
        </div>
      )
    },
    filterFn: (row, createdAt, value) => {
      return value.includes(createdAt)
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.original.status
      )

      if (!status) return null

      return (
        <div className='flex w-[100px] items-center'>
          {status.icon && (
            <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
          )}
          <strong>{status.label}</strong>
        </div>
      )
    },
    filterFn: (row, status, value) => {
      return value.includes(status)
    },
  },
  {
    accessorKey: 'image-count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image Count' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center'>
          {Number(row.original.images.length)}
        </div>
      )
    },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.original.images)
    // },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'sub-city',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sub City' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center'>
          {row.original.address?.borough}
        </div>
      )
    },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.original?.[id])
    // },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'district',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='District' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center'>
          {row.original.address?.district}
        </div>
      )
    },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.original?.[id])
    // },
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
