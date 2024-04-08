//@ts-nocheck
import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from './data-table-column-header'

import { statuses, types } from '../data/data'
import {
  Address,
  Contact,
  FacebookAccountType,
  MessagingPlatformAccountType,
  PlaceStatus,
  PlaceType,
  Profile,
} from '@/model'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Link } from 'react-router-dom'

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
  contact: Contact
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
      return (
        <div className='hidden-scrollbar w-[80px] overflow-hidden overflow-x-auto'>
          {row.original.name['EN' as any]}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'amharicName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amharic Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='hidden-scrollbar w-[80px] overflow-hidden overflow-x-auto'>
          {row.original.name['AM' as any]}
        </div>
      )
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
      const type = types.find((status) => status.value === row.original.type)

      if (!type) return null

      return (
        <div className='hidden-scrollbar hidden-scrollbar flex w-[100px] items-center overflow-hidden overflow-x-auto'>
          <strong>
            {type.label}
            {type.value === PlaceType.OTHER && row.original.customType
              ? ` (${row.original.customType})`
              : ''}
          </strong>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
    enableResizing: true,
  },
  {
    accessorKey: 'coordinates',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Coordinates' />
    ),
    cell: ({ row }) => (
      <div className='hidden-scrollbar w-[80px] overflow-hidden overflow-x-auto'>
        <Link
          target='_blank'
          to={`https://www.google.com/maps?q=${Number(row.original.latitude)},${Number(row.original.longitude)}`}
        >
          <Badge variant='outline' className='whitespace-nowrap'>
            {`${Number(row.original.latitude)}, ${Number(row.original.longitude)}`}
          </Badge>
        </Link>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: 'addedBy',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Added By' />
  //   ),
  //   cell: ({ row }) => {
  //     const addedBy = row.original.addedBy
  //
  //     if (!addedBy) return null
  //
  //     return (
  //       <div className='hidden-scrollbar flex w-[100px] items-center overflow-hidden overflow-x-auto'>
  //         <span>{`${addedBy.firstName}${addedBy.lastName ? ` ${addedBy.lastName}` : ''}`}</span>
  //       </div>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  //   // filterFn: (row, id, value) => {
  //   //   return value.includes(row.original.addedBy)
  //   // },
  // },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      return (
        <div className='hidden-scrollbar flex w-[100px] items-center overflow-hidden overflow-x-auto'>
          <span>{row.original.createdAt ?? ''}</span>
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
        <div className='hidden-scrollbar flex w-[100px] items-center overflow-hidden overflow-x-auto'>
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
    accessorKey: 'images',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Images' />
    ),
    cell: ({ row }) => {
      return (
        <div className='hidden-scrollbar flex w-[100px] items-center gap-2 overflow-hidden overflow-x-auto'>
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
        <div className='hidden-scrollbar flex w-[100px] items-center overflow-hidden overflow-x-auto'>
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
        <div className='hidden-scrollbar flex w-[100px] items-center overflow-hidden overflow-x-auto'>
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
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => {
      return (
        <div className='hidden-scrollbar flex w-[100px] items-center gap-2 overflow-hidden overflow-x-auto'>
          <Link
            target='_blank'
            to={`tel:${String(row.original.contact?.phone?.primary ?? '')}`}
          >
            {String(row.original.contact?.phone?.primary ?? '')}
          </Link>

          {row.original.contact?.phone?.alternatives?.map((v) => {
            return (
              <Link target='_blank' to={`tel:${v}`}>
                <Badge variant='outline' className='whitespace-nowrap'>
                  {v}
                </Badge>
              </Link>
            )
          })}
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
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => {
      return (
        <div className='hidden-scrollbar flex w-[100px] items-center gap-2 overflow-hidden overflow-x-auto'>
          <Link
            target='_blank'
            to={`mailto:${String(row.original.contact?.email?.primary ?? '')}`}
          >
            {String(row.original.contact?.email?.primary ?? '')}
          </Link>

          {row.original.contact?.email?.alternatives?.map((v) => {
            return (
              <Link target='_blank' to={`mailto:${v}`}>
                <Badge variant='outline' className='whitespace-nowrap'>
                  {v}
                </Badge>
              </Link>
            )
          })}
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
    accessorKey: 'website',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Website' />
    ),
    cell: ({ row }) => {
      return (
        <div className='hidden-scrollbar flex w-[100px] items-center overflow-hidden overflow-x-auto'>
          <Link
            target='_blank'
            to={`${String(row.original.contact?.socialMedia?.website ?? '')}`}
          >
            <u>{String(row.original.contact?.socialMedia?.website ?? '')}</u>
          </Link>
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
    accessorKey: 'telegram',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Telegram' />
    ),
    cell: ({ row }) => {
      return (
        <div className='hidden-scrollbar flex w-[100px] items-center gap-2 overflow-hidden overflow-x-auto'>
          {row.original.contact?.socialMedia?.telegram?.map((v) => {
            return (
              <Link target='_blank' to={`https://t.me/${v.handle}`}>
                <Badge variant='outline' className='whitespace-nowrap'>
                  @{v.handle}
                </Badge>
              </Link>
            )
          })}
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
    accessorKey: 'whatsapp',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Whatsapp' />
    ),
    cell: ({ row }) => {
      return (
        <div className='hidden-scrollbar flex w-[100px] items-center gap-2 overflow-hidden overflow-x-auto'>
          {row.original.contact?.socialMedia?.whatsapp?.map((v) => {
            return v.type === MessagingPlatformAccountType.BOT ? (
              <Badge
                variant='outline'
                className='whitespace-nowrap text-muted-foreground'
              >
                @{v.handle}
              </Badge>
            ) : (
              <Link
                target='_blank'
                to={`${v.type === MessagingPlatformAccountType.PERSONAL ? `https://wa.me/` : v.type === MessagingPlatformAccountType.GROUP ? 'https://chat.whatsapp.com/' : ''}${v.handle}`}
              >
                <Badge variant='outline' className='whitespace-nowrap'>
                  {v.type !== MessagingPlatformAccountType.CHANNEL ? '@' : ''}
                  {v.handle}
                </Badge>
              </Link>
            )
          })}
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
    accessorKey: 'facebook',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Facebook' />
    ),
    cell: ({ row }) => {
      return (
        <div className='hidden-scrollbar flex w-[100px] items-center gap-2 overflow-hidden overflow-x-auto'>
          {row.original.contact?.socialMedia?.facebook?.map((v) => {
            return (
              <Link
                target='_blank'
                to={`https://www.facebook.com/${v.type === FacebookAccountType.GROUP ? 'groups/' : ''}${v.handle}`}
              >
                <Badge variant='outline' className='whitespace-nowrap'>
                  @{v.handle}
                </Badge>
              </Link>
            )
          })}
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
    accessorKey: 'twitter',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Twitter' />
    ),
    cell: ({ row }) => {
      return (
        <div className='hidden-scrollbar flex w-[100px] items-center gap-2 overflow-hidden overflow-x-auto'>
          {row.original.contact?.socialMedia?.x?.map((v) => {
            return (
              <Link target='_blank' to={`https://twitter.com/${v}`}>
                <Badge variant='outline' className='whitespace-nowrap'>
                  @{v}
                </Badge>
              </Link>
            )
          })}
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
    accessorKey: 'instagram',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Instagram' />
    ),
    cell: ({ row }) => {
      return (
        <div className='hidden-scrollbar flex w-[100px] items-center gap-2 overflow-hidden overflow-x-auto'>
          {row.original.contact?.socialMedia?.instagram?.map((v) => {
            return (
              <Link target='_blank' to={`https://instagram.com/${v}`}>
                <Badge variant='outline' className='whitespace-nowrap'>
                  @{v}
                </Badge>
              </Link>
            )
          })}
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
