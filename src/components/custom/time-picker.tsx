import * as React from 'react'
import { TimePickerInput } from './time-picker-input'
import {
  display12HourValue,
  Period,
  setDateByType,
} from '@/components/custom/time-picker-utils.tsx'
import { Button } from '@/components/ui/button.tsx'

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

const TimePicker = function TimePicker({ date, setDate }: TimePickerProps) {
  const [period, setPeriod] = React.useState<Period>('PM')

  const minuteRef = React.useRef<HTMLInputElement | null>(null)
  const hourRef = React.useRef<HTMLInputElement | null>(null)
  const periodRef = React.useRef<HTMLButtonElement | null>(null)

  return (
    <div className='flex items-center gap-2'>
      <TimePickerInput
        picker='12hours'
        date={date}
        setDate={setDate}
        ref={hourRef}
        onRightFocus={() => minuteRef.current?.focus()}
      />

      <TimePickerInput
        picker='minutes'
        date={date}
        setDate={setDate}
        ref={minuteRef}
        onLeftFocus={() => hourRef.current?.focus()}
        onRightFocus={() => periodRef.current?.focus()}
      />

      <Button
        ref={periodRef}
        type={'button'}
        variant='outline'
        className={'h-4 w-4 p-4'}
        onClick={() => {
          setPeriod((p) => {
            const newPeriod = p === 'AM' ? 'PM' : 'AM'

            setDate(
              setDateByType(
                new Date(date),
                display12HourValue(date?.getHours()),
                '12hours',
                newPeriod
              )
            )

            return newPeriod
          })
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
          if (e.key === 'ArrowLeft') minuteRef.current?.focus()
        }}
      >
        <span>{period}</span>
      </Button>
    </div>
  )
}

TimePicker.displayName = 'TimePicker'

export { TimePickerProps, TimePicker }
