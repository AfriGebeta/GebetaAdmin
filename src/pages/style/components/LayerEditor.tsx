import { NumberInput, ColorInput } from './StyleInputs'

type Layer = any

export const LayerEditor = ({
  selectedLayer,
  selectedLayerId,
  layerJSON,
  jsonError,
  expandedSections,
  onToggleSection,
  onLayerJSONChange,
  onApplyEdits,
}: {
  selectedLayer: Layer | null
  selectedLayerId: string | null
  layerJSON: string
  jsonError: string
  expandedSections: { paint: boolean; json: boolean }
  onToggleSection: (section: string) => void
  onLayerJSONChange: (json: string) => void
  onApplyEdits: (layer: Layer) => void
}) => {
  if (!selectedLayerId || !selectedLayer) {
    return (
      <div className='flex flex-1 items-center justify-center text-muted-foreground'>
        Select a layer to edit
      </div>
    )
  }

  return (
    <div className='flex h-full w-[50%] flex-col bg-background'>
      <div className='border-b p-3'>
        <h3 className='text-lg font-medium'>
          Layer: <span className='text-primary'>{selectedLayerId}</span>
        </h3>
      </div>
      <div className='flex-1 space-y-3 overflow-y-auto p-3'>
        {selectedLayer.type === 'line' && (
          <div className='rounded-md border'>
            <button
              onClick={() => onToggleSection('paint')}
              className='flex w-full items-center justify-between bg-muted px-3 py-2 hover:bg-accent'
            >
              <span>Paint properties</span>
              <svg
                className={`h-4 w-4 transition-transform ${
                  expandedSections.paint ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>
            {expandedSections.paint && (
              <div className='space-y-3 bg-background p-3 text-xs'>
                <NumberInput
                  label='Opacity'
                  value={selectedLayer.paint?.['line-opacity'] || 1}
                  onChange={(val) => {
                    const updated = {
                      ...selectedLayer,
                      paint: {
                        ...selectedLayer.paint,
                        'line-opacity': val,
                      },
                    }
                    onLayerJSONChange(JSON.stringify(updated, null, 2))
                    onApplyEdits(updated)
                  }}
                  min={0}
                  max={1}
                  step={0.01}
                />
                <ColorInput
                  label='Color'
                  value={selectedLayer.paint?.['line-color'] || '#41515c'}
                  onChange={(val) => {
                    const updated = {
                      ...selectedLayer,
                      paint: {
                        ...selectedLayer.paint,
                        'line-color': val,
                      },
                    }
                    onLayerJSONChange(JSON.stringify(updated, null, 2))
                    onApplyEdits(updated)
                  }}
                />
                <NumberInput
                  label='Width'
                  value={selectedLayer.paint?.['line-width'] || 1}
                  onChange={(val) => {
                    const updated = {
                      ...selectedLayer,
                      paint: {
                        ...selectedLayer.paint,
                        'line-width': val,
                      },
                    }
                    onLayerJSONChange(JSON.stringify(updated, null, 2))
                    onApplyEdits(updated)
                  }}
                  min={0}
                  max={20}
                  step={0.1}
                />
                <div className='mt-3 border-t border-gray-700 pt-2'>
                  <button
                    onClick={() => onToggleSection('json')}
                    className='text-xs text-blue-400 hover:underline'
                  >
                    Edit JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className='rounded-md border'>
          <button
            onClick={() => onToggleSection('json')}
            className='flex w-full items-center justify-between bg-muted px-3 py-2 hover:bg-accent'
          >
            <span>JSON Editor</span>
            <svg
              className={`h-4 w-4 transition-transform ${
                expandedSections.json ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
          {expandedSections.json && (
            <div className='bg-background p-3'>
              <textarea
                className='resize-vertical h-40 w-full rounded-md border bg-background p-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring'
                value={layerJSON}
                onChange={(e) => {
                  const newValue = e.target.value
                  onLayerJSONChange(newValue)
                  try {
                    const parsed = JSON.parse(newValue)
                    onApplyEdits(parsed)
                  } catch (err) {}
                }}
                spellCheck={false}
                placeholder='Edit layer JSON here...'
              />
              {jsonError && (
                <div className='mt-1 text-xs text-destructive'>{jsonError}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
