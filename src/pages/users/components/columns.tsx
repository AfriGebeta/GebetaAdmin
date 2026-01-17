//@ts-nocheck
import { Profile } from '@/model'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ChevronDown } from 'lucide-react'

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
  {
    accessorKey: 'allowed_scopes',
    header: 'Scopes',
    cell: ({ row }) => {
      const scopes = row.original?.allowed_scopes || []
      if (scopes.length === 0) {
        return <span className='text-sm text-muted-foreground'>None</span>
      }
      return (
        <Popover>
          <PopoverTrigger asChild>
            <button className='flex items-center gap-1 text-sm hover:underline'>
              <Badge variant='secondary' className='text-xs'>
                {scopes.length} scope{scopes.length !== 1 ? 's' : ''}
              </Badge>
              <ChevronDown className='h-3 w-3' />
            </button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-3' align='start'>
            <div className='flex flex-wrap gap-1'>
              {scopes.map((scope) => (
                <Badge key={scope} variant='outline' className='text-xs'>
                  {scope}
                </Badge>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )
    },
  },
]
