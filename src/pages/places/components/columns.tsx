//@ts-nocheck
import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from './data-table-column-header'

import { statuses } from '../data/data'
import { Address, PlaceStatus, PlaceType, Profile } from '@/model'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { Card, CardContent } from '@/components/ui/card.tsx'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel.tsx'

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
        <div className='w-[80px] overflow-hidden'>
          {row.original.type === PlaceType.OTHER
            ? row.original.customType
              ? `OTHER (${row.original.customType})`
              : 'OTHER'
            : row.original.type}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
    enableResizing: true,
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
      <DataTableColumnHeader column={column} title='Images' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center gap-2 overflow-hidden'>
          <Dialog>
            {row.original.images?.map((image, index) => (
              <>
                <DialogTrigger>
                  <Avatar className='border border-muted'>
                    <AvatarImage src={image} />
                    <AvatarFallback>{index + 1}</AvatarFallback>
                  </Avatar>
                </DialogTrigger>
              </>
            ))}
            <DialogContent className='max-w-screen h-full items-center justify-center border-none bg-transparent'>
              <Carousel className='w-full max-w-xs'>
                <CarouselContent className='items-center'>
                  {row.original.images?.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className='p-1'>
                        <div className='flex items-center justify-center overflow-hidden rounded-md border border-muted'>
                          <img src={image} alt={'image'} />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {row.original.images?.length > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            </DialogContent>
          </Dialog>
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
          {String(row.original.address?.borough)}
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
          {String(row.original.address?.district)}
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
