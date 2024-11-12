import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import React from 'react'

interface DeleteProfileModalProps {
  id: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (id: string) => void
}

const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({
  id,
  isOpen,
  onClose,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-fit w-fit'>
        <DialogHeader>
          <DialogTitle>Delete Profile</DialogTitle>
        </DialogHeader>
        <div>
          <p>Are you sure you want to delete ?</p>
          <div className='mt-4 flex'>
            <Button
              className='mr-4'
              variant='destructive'
              onClick={() => onSubmit(id)}
            >
              Delete
            </Button>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProfileModal
