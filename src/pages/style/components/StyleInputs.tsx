export const NumberInput = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}) => (
  <div className='mb-2 flex items-center gap-2'>
    <label className='w-24 text-xs text-muted-foreground'>{label}</label>
    <input
      type='number'
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className='w-full rounded border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring'
    />
  </div>
)

export const ColorInput = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) => {
  let hexValue = '#000000'
  try {
    if (
      typeof value === 'string' &&
      value.startsWith('#') &&
      value.length === 7
    ) {
      hexValue = value
    }
  } catch {}
  return (
    <div className='mb-2 flex items-center gap-2'>
      <label className='w-24 text-xs text-muted-foreground'>{label}</label>
      <input
        type='color'
        value={hexValue}
        onChange={(e) => onChange(e.target.value)}
        className='h-8 w-8 cursor-pointer rounded border'
      />
      <input
        type='text'
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className='flex-1 rounded border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring'
        placeholder='#RRGGBB or rgba(...)'
      />
    </div>
  )
}
