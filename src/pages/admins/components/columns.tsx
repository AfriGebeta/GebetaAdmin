import { Profile } from '@/model'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Profile>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
]
