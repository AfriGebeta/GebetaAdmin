type Layer = {
  id: string
  type: string
  'source-layer'?: string
}

type GroupedLayers = Record<string, Layer[]>

const renderIcon = (type: string) => {
  switch (type) {
    case 'fill':
      return <div className='h-3 w-3 rounded-sm bg-blue-500'></div>
    case 'line':
      return <div className='h-0.5 w-4 bg-green-500'></div>
    case 'symbol':
      return (
        <div className='h-3 w-3 rounded-full border border-yellow-500'></div>
      )
    case 'circle':
      return <div className='h-3 w-3 rounded-full bg-purple-500'></div>
    default:
      return <div className='h-3 w-3 rounded-sm bg-gray-500'></div>
  }
}

export const LayerList = ({
  groupedLayers,
  selectedLayerId,
  onSelectLayer,
  isCollapsed,
  onToggleCollapse,
}: {
  groupedLayers: GroupedLayers | null
  selectedLayerId: string | null
  onSelectLayer: (layerId: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}) => {
  if (isCollapsed) {
    return (
      <div className='flex h-full w-10 flex-col items-center border-r bg-background py-3'>
        <button
          onClick={onToggleCollapse}
          className='rounded-md p-2 hover:bg-accent'
          title='Expand Layers'
        >
          <svg
            className='h-4 w-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className='h-full w-full overflow-y-auto border-r bg-background p-3 '>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='font-sm text-lg font-bold'>Layers</h2>
        <button
          onClick={onToggleCollapse}
          className='rounded-md p-1 hover:bg-accent'
          title='Collapse Layers'
        >
          <svg
            className='h-4 w-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>
      </div>
      {groupedLayers ? (
        Object.entries(groupedLayers).map(([group, layers]) => (
          <div key={group} className='-ml-3 mb-4'>
            <div className='px-2 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground'>
              {group}
            </div>
            {layers.map((layer) => (
              <div
                key={layer.id}
                onClick={() => onSelectLayer(layer.id)}
                className={`flex cursor-pointer items-center rounded-md px-3 py-2 transition-colors ${
                  selectedLayerId === layer.id
                    ? 'border-l-4 border-primary bg-accent'
                    : 'hover:bg-accent'
                }`}
              >
                {renderIcon(layer.type)}
                <span className='ml-1 truncate text-xs'>{layer.id}</span>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className='text-sm text-muted-foreground'>Loading...</div>
      )}
    </div>
  )
}
