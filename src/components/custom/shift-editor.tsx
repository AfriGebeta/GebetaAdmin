import { TimePicker } from '@/components/custom/time-picker.tsx'
import { defaultShift, Shift } from '@/components/custom/open-hours-editor.tsx'

interface ShiftEditorProps {
  value: Shift
  onChange: (value: Shift) => void
  containerClasses?: string
}

const ShiftEditor = function ShiftEditor({
  value = defaultShift,
  onChange,
  containerClasses = '',
}: ShiftEditorProps) {
  return (
    <div
      className={`flex flex-1 flex-row flex-wrap items-center justify-between gap-2 ${containerClasses}`}
    >
      <div className={`flex flex-col`}>
        <span className={`text-sm font-bold text-muted-foreground`}>From</span>

        <TimePicker
          date={new Date(value[0])}
          setDate={(date) => {
            onChange([date?.getTime() ?? new Date().getTime(), value[1]])
          }}
        />
      </div>

      <div className={`flex flex-col`}>
        <span className={`text-sm font-bold text-muted-foreground`}>To</span>

        <TimePicker
          date={new Date(value[1])}
          setDate={(date) => {
            onChange([value[0], date?.getTime() ?? new Date(0).getTime()])
          }}
        />
      </div>
    </div>
  )
}

ShiftEditor.displayName = 'ShiftEditor'

export { ShiftEditorProps, ShiftEditor }
