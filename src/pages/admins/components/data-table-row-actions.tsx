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
import api from '@/services/api' // Make sure to import your API service
import { useToast } from '@/components/ui/use-toast'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  apiAccessToken: string
  onToggleActivation: (id: string, isActive: boolean) => void
}

export function DataTableRowActions<TData>({
  row,
  apiAccessToken,
  onToggleActivation,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast()

  const handleToggleActivation = async () => {
    const id = row.original.id // Assuming your profile object has an `id` field
    const isActive = !row.original.active // Toggle active state

    try {
      const response = await api.activateProfile({
        apiAccessToken,
        id,
      })

      if (response.ok) {
        // Call the onToggleActivation callback to update the UI
        onToggleActivation(id, isActive)
        toast({
          title: 'Profile Updated',
          description: isActive
            ? 'Profile activated successfully!'
            : 'Profile deactivated successfully!',
          variant: 'default',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error Activating Profile',
          description: error.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error toggling activation:', error)
      toast({
        title: 'Request Failed',
        description: 'Check your network connection!',
        variant: 'destructive',
      })
    }
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
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleActivation}>
          {row.original.active ? 'Deactivate' : 'Activate'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
