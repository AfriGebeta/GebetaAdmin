//@ts-nocheck
import { Button } from '@/components/ui/button'
import { Profile } from '@/model'
import MapModal from './MapModal'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const columns: ColumnDef<Profile>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <p>{row.original?.name}</p>
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return <p>{row.original?.email}</p>
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => {
      return <p>{row.original?.phone}</p>
    },
  },
  {
    accessorKey: 'purchased_date',
    header: 'Purchased Date',
    cell: ({ row }) => {
      return <p>{row.original?.purchased_date}</p>
    },
  },
]
