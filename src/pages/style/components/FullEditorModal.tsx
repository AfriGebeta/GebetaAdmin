export const FullEditorModal = ({
  show,
  styleJSON,
  onClose,
  onChange,
  onApply,
}: {
  show: boolean
  styleJSON: string
  onClose: () => void
  onChange: (json: string) => void
  onApply: () => void
}) => {
  if (!show) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='flex h-[90vh] w-[90vw] max-w-6xl flex-col rounded-lg border bg-background shadow-lg'>
        <div className='flex items-center justify-between border-b p-4'>
          <h3 className='text-lg font-semibold'>Full Style Editor</h3>
          <div className='flex space-x-2'>
            <button
              onClick={onApply}
              className='rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90'
            >
              Apply Changes
            </button>
            <button
              onClick={onClose}
              className='rounded bg-secondary px-4 py-2 text-sm hover:bg-secondary/80'
            >
              Close
            </button>
          </div>
        </div>
        <div className='flex-1 overflow-hidden p-4'>
          <textarea
            className='h-full w-full resize-none rounded-md border bg-background p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring'
            value={styleJSON}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            placeholder='Edit full style JSON here...'
          />
        </div>
      </div>
    </div>
  )
}
