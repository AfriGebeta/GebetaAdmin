import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { newPassword: string; confirmPassword: string }) => void
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validatePasswords = () => {
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    setError('')
    return true
  }

  const handlePasswordChange = (value: string, isNewPassword: boolean) => {
    if (isNewPassword) {
      setNewPassword(value)
    } else {
      setConfirmPassword(value)
    }
    // Clear error when user types
    setError('')
  }

  const handleSubmit = async () => {
    if (!validatePasswords()) {
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        newPassword,
        confirmPassword,
      })
      // Clear fields and error on successful submission
      setNewPassword('')
      setConfirmPassword('')
      setError('')
    } catch (err) {
      setError('Failed to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[50%]'>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className='flex w-full flex-col items-center'>
            <video autoPlay loop src='/animation.webm' />
            <h3>Updating password...</h3>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='space-y-1'>
              <Label htmlFor='newPassword'>New Password</Label>
              <div className='relative'>
                <Input
                  id='newPassword'
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value, true)}
                  placeholder='Enter new password'
                  className={`pr-10 ${error ? 'border-red-500' : ''}`}
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2'
                >
                  {showNewPassword ? (
                    <EyeOff className='h-4 w-4 text-gray-500' />
                  ) : (
                    <Eye className='h-4 w-4 text-gray-500' />
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-1'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => handlePasswordChange(e.target.value, false)}
                  placeholder='Confirm new password'
                  className={`pr-10 ${error ? 'border-red-500' : ''}`}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4 text-gray-500' />
                  ) : (
                    <Eye className='h-4 w-4 text-gray-500' />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className='text-sm font-medium text-red-500'>{error}</div>
            )}

            <Button
              onClick={handleSubmit}
              className='bg-[#ffa818] font-semibold text-white hover:bg-[#ff9800]'
              disabled={loading || !newPassword || !confirmPassword}
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ResetPasswordModal
