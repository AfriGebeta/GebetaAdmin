//@ts-nocheck
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  apiAccessToken: string
  onToggleActivation: (id: string, isActive: boolean) => void
  onEdit: (profile: any) => void
  onDelete: (profile: any) => void
}

export function DataTableRowActions<TData>({
  row,
  apiAccessToken,
  onToggleActivation,
  onEdit,
  onDelete,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast()

  const handleToggle = () => {
    const id = row.original.id
    const isActive = row.original.active
    onToggleActivation(id, isActive)
  }

  const handleEdit = () => {
    onEdit(row.original)
    // console.log("Editing profile")
  }

  const handleDelete = () => {
    onDelete(row.original)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggle}>
          {row.original.active ? 'Deactivate' : 'Activate'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
