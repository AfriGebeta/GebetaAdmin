type PresetStyle = {
  name: string
  style?: any
  url?: string
}

export const OpenStyleModal = ({
  show,
  presetStyles,
  fileInputRef,
  onClose,
  onLoadPreset,
}: {
  show: boolean
  presetStyles: PresetStyle[]
  fileInputRef: React.RefObject<HTMLInputElement>
  onClose: () => void
  onLoadPreset: (preset: PresetStyle) => void
}) => {
  if (!show) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-[600px] rounded-lg border bg-background p-6 shadow-lg'>
        <h3 className='mb-4 text-lg font-semibold'>Open Style</h3>

        <div className='mb-4'>
          <h4 className='mb-2 text-sm font-medium'>Preset Styles</h4>
          <div className='grid grid-cols-2 gap-3'>
            {presetStyles.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onLoadPreset(preset)}
                className='rounded-lg border bg-card p-4 text-left transition hover:bg-accent'
              >
                <div className='font-medium'>{preset.name}</div>
                <div className='mt-1 text-xs text-muted-foreground'>
                  {preset.style ? 'Local' : 'Remote'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className='border-t pt-4'>
          <h4 className='mb-2 text-sm font-medium'>Or import from file</h4>
          <button
            onClick={() => {
              fileInputRef.current?.click()
              onClose()
            }}
            className='w-full rounded-lg border-2 border-dashed bg-muted p-4 transition hover:bg-accent'
          >
            Choose JSON file from your computer
          </button>
        </div>

        <div className='mt-6 flex justify-end'>
          <button
            onClick={onClose}
            className='rounded bg-secondary px-4 py-2 text-sm hover:bg-secondary/80'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
