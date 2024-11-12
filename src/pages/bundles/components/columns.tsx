//@ts-nocheck
import { ColumnDef } from '@tanstack/react-table'
import { Bundle } from '@/model/bundle.ts'

export const columns: ColumnDef<Bundle>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <p>{row.original?.name}</p>
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      return <p>{row.original?.price} Birr</p>
    },
  },
  {
    accessorKey: 'rate',
    header: 'Rate',
    cell: ({ row }) => {
      return <p>{row.original?.rate} </p>
    },
  },
  {
    accessorKey: 'expiredIn',
    header: 'Expired In',
    cell: ({ row }) => {
      return <p>{row.original?.expiredIn} days</p>
    },
  },
  {
    accessorKey: 'expirationDate',
    header: 'Expiration Date',
    cell: ({ row }) => {
      return <p>{row.original?.expirationDate}</p>
    },
  },
  // {
  //   accessorKey: 'includedCallTypes',
  //   header: 'Included Call Types',
  //   cell: ({ row }) => {
  //     return <p>derman</p>
  //   }
  // },
  // {
  //   accessorKey: 'callCaps',
  //   header: 'Call Caps',
  //   cell: ({ row }) => {
  //     return <p>{row.original?.expiration}</p>
  //   }
  // },
]
