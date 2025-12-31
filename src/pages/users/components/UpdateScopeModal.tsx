//@ts-nocheck
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Profile } from '@/model'

const AVAILABLE_SCOPES = [
  'FEATURE_ALL',
  'MATRIX',
  'ONM',
  'TILE',
  'DIRECTION',
  'TSS',
  'VRP',
  'TRACKING_HTTP',
  'TRACKING_SOCKET',
  'GEOCODING',
]

interface UpdateScopeModalProps {
  profileData: Profile
  isOpen: boolean
  onClose: () => void
  onSubmit: (scopes: string[]) => void
}

export default function UpdateScopeModal({
  profileData,
  isOpen,
  onClose,
  onSubmit,
}: UpdateScopeModalProps) {
  const [selectedScopes, setSelectedScopes] = useState<string[]>([])

  useEffect(() => {
    if (profileData?.allowed_scopes && profileData.allowed_scopes.length > 0) {
      setSelectedScopes(profileData.allowed_scopes)
    } else {
      setSelectedScopes([])
    }
  }, [profileData, isOpen])

  const handleToggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    )
  }

  const handleSubmit = () => {
    onSubmit(selectedScopes)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Update User Scope</DialogTitle>
          <DialogDescription>
            Select the scopes for {profileData?.username || profileData?.name}
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='space-y-3'>
            {AVAILABLE_SCOPES.map((scope) => (
              <div key={scope} className='flex items-center space-x-3'>
                <Checkbox
                  id={scope}
                  checked={selectedScopes.includes(scope)}
                  onCheckedChange={() => handleToggleScope(scope)}
                />
                <Label
                  htmlFor={scope}
                  className='cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  {scope}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update Scope</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
