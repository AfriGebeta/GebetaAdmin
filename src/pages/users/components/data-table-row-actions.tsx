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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  apiAccessToken: string
  onEdit: (profile: any) => void
  onDelete: (profile: any) => void
  onUpdateDate: (profile: any) => void
  onSetToken: (profile: any) => void
  onResetPassword: (profile: any) => void
  onShowUsage: (profile: any) => void
  onBuyBundle: (profile: any) => void
  onUpdateScope: (profile: any) => void
}

export function DataTableRowActions<TData>({
  row,
  apiAccessToken,
  onEdit,
  onDelete,
  onUpdateDate,
  onSetToken,
  onResetPassword,
  onShowUsage,
  onBuyBundle,
  onUpdateScope,
}: DataTableRowActionsProps<TData>) {
  const handleEdit = () => {
    onEdit(row.original)
    // console.log("Editing profile")
  }

  const handleDelete = () => {
    onDelete(row.original)
  }

  const handleUpdateDate = () => {
    onUpdateDate(row.original)
  }

  const handleSetUserToken = () => {
    onSetToken(row.original)
  }

  const handleResetPassword = () => {
    onResetPassword(row.original)
  }

  const handleShowUsage = () => {
    onShowUsage(row.original)
  }

  const handleBuyHandle = () => {
    onBuyBundle(row.original)
  }

  const handleUpdateScope = () => {
    onUpdateScope(row.original)
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
        <DropdownMenuItem onClick={handleBuyHandle}>
          Buy Bundle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleResetPassword}>
          Reset Password
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShowUsage}>
          Show Usage
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSetUserToken}>
          Set Token
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleUpdateScope}>
          Update Scope
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        <DropdownMenuItem onClick={handleUpdateDate}>
          Update Date
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
