type NewLayerConfig = {
  id: string
  type: string
  source: string
  sourceLayer: string
}

export const AddLayerModal = ({
  show,
  config,
  vectorSources,
  onClose,
  onChange,
  onCreate,
}: {
  show: boolean
  config: NewLayerConfig
  vectorSources: string[]
  onClose: () => void
  onChange: (field: string, value: string) => void
  onCreate: () => void
}) => {
  if (!show) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-96 rounded-lg border bg-background p-6 shadow-lg'>
        <h3 className='mb-4 text-lg font-semibold'>Add New Layer</h3>

        <div className='space-y-3'>
          <div>
            <label className='mb-1 block text-xs text-muted-foreground'>
              Layer
            </label>
            <input
              type='text'
              value={config.id}
              onChange={(e) => onChange('id', e.target.value)}
              className='w-full rounded border bg-background px-2 py-1 text-sm'
              placeholder='eg. my layer'
            />
          </div>

          <div>
            <label className='mb-1 block text-xs text-muted-foreground'>
              Type
            </label>
            <select
              value={config.type}
              onChange={(e) => onChange('type', e.target.value)}
              className='w-full rounded border bg-background px-2 py-1 text-sm'
            >
              <option value='fill'>Fill</option>
              <option value='line'>Line</option>
              <option value='circle'>Circle</option>
              <option value='symbol'>Symbol</option>
              <option value='background'>Background</option>
            </select>
          </div>

          <div>
            <label className='mb-1 block text-xs text-muted-foreground'>
              Source
            </label>
            <select
              value={config.source}
              onChange={(e) => onChange('source', e.target.value)}
              className='w-full rounded border bg-background px-2 py-1 text-sm'
            >
              <option value=''> Select Source</option>
              {vectorSources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='mb-1 block text-xs text-muted-foreground'>
              Source Layer (optional)
            </label>
            <input
              type='text'
              value={config.sourceLayer}
              onChange={(e) => onChange('sourceLayer', e.target.value)}
              className='w-full rounded border bg-background px-2 py-1 text-sm'
              placeholder='e.g. transportation'
            />
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-2'>
          <button
            onClick={onClose}
            className='rounded bg-secondary px-3 py-1.5 text-sm hover:bg-secondary/80'
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            className='rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90'
          >
            Create Layer
          </button>
        </div>
      </div>
    </div>
  )
}
