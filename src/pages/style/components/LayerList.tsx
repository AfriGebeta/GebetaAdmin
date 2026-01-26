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
}: {
  groupedLayers: GroupedLayers | null
  selectedLayerId: string | null
  onSelectLayer: (layerId: string) => void
}) => {
  return (
    <div className='h-full w-[50%] overflow-y-auto border-r bg-background p-3'>
      <h2 className='mb-3 text-lg font-semibold'>Layers</h2>
      {groupedLayers ? (
        Object.entries(groupedLayers).map(([group, layers]) => (
          <div key={group} className='mb-4'>
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
                <span className='ml-2 truncate text-sm'>{layer.id}</span>
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
