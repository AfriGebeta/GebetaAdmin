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
import { useNavigate } from 'react-router-dom'
import api from '@/services/api.ts'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  apiAccessToken: string
}

export function DataTableRowActions<TData>({
  row,
  apiAccessToken,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(`/boundary/update/${row.original.id}`)
  }

  const handleDelete = async () => {
    try {
      const response = await api.deleteBoundary({
        apiAccessToken,
        id: row.original.id,
      })

      toast({
        title: 'Boundary deleted',
        description: 'Boundary has been deleted',
      })

      if (!response.status === 201) {
        const responseData = (await response.json()).error

        toast({
          title: `${responseData.namespace} / ${responseData.code}`,
          description: responseData.message,
          variant: 'destructive',
        })
      }
    } catch (e) {
      console.log(e)
      toast({
        title: 'Error',
        description: 'An error occurred',
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
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
