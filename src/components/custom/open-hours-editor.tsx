import { Label } from '@/components/ui/label.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { ShiftEditor } from '@/components/custom/shift-editor.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  display12HourValue,
  setDateByType,
} from '@/components/custom/time-picker-utils.tsx'
import * as React from 'react'
import { Minus } from 'lucide-react'
import { useEffect, useState } from 'react'

const epochDate = new Date(0)

type Shift = Array<number>

const defaultShift = [
  epochDate.setUTCHours(9, 0, 0, 0),
  epochDate.setUTCHours(17, 0, 0, 0),
]

type OpenShift = { open: boolean; shifts: Array<Shift> }

const defaultOpenShift = { open: true, shifts: [defaultShift] }

interface OpenHours {
  monday: OpenShift
  tuesday: OpenShift
  wednesday: OpenShift
  thursday: OpenShift
  friday: OpenShift
  saturday: OpenShift
  sunday: OpenShift
}

const defaultOpenHours = {
  monday: defaultOpenShift,
  tuesday: defaultOpenShift,
  wednesday: defaultOpenShift,
  thursday: defaultOpenShift,
  friday: defaultOpenShift,
  saturday: { ...defaultOpenShift, open: false },
  sunday: { ...defaultOpenShift, open: false },
}

const days: Array<keyof OpenHours> = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

const daysLabel: Record<[keyof OpenHours], string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

interface OpenHoursEditorProps {
  value: OpenHours
  onChange: (value: OpenHours) => void
  containerClasses?: string
}

const OpenHoursEditor = function OpenHoursEditor({
  value = defaultOpenHours,
  onChange,
  containerClasses,
}: OpenHoursEditorProps) {
  const [_value, _setValue] = useState(value)

  useEffect(() => {
    onChange(_value)
  }, [_value])

  return (
    <div className={`flex w-full flex-col gap-4 ${containerClasses}`}>
      {days.map((day, index) => (
        <div
          key={index}
          className={`flex w-full flex-col gap-2 ${!_value[day].open ? 'text-muted-foreground' : ''}`}
        >
          <div className={`flex flex-row items-center justify-between gap-4`}>
            <Label
              htmlFor={`${day}`}
              className='text-sm font-medium leading-none'
            >
              {daysLabel[day]}
            </Label>

            <div className={`flex flex-row items-center gap-2`}>
              <Button
                type={'button'}
                variant='outline'
                className={'h-4 p-4'}
                onClick={() =>
                  _setValue((val) => ({
                    ...val,
                    [day]: {
                      ...val[day],
                      shifts: [...val[day].shifts, defaultShift],
                    },
                  }))
                }
              >
                <span>Add Shift</span>
              </Button>

              <div className={`flex flex-row items-center gap-2`}>
                <Checkbox
                  id={`${day}`}
                  checked={_value[day].open}
                  onCheckedChange={(checkedState) =>
                    _setValue((val) => ({
                      ...val,
                      [day]: { ...val[day], open: checkedState },
                    }))
                  }
                />

                <Label
                  htmlFor={`${day}`}
                  className='text-xs font-medium leading-none'
                >
                  Open
                </Label>
              </div>
            </div>
          </div>

          <div className={`flex w-full flex-col gap-4`}>
            {(_value[day].shifts.length > 0
              ? _value[day].shifts
              : defaultOpenShift.shifts
            ).map((shift, i) => (
              <div
                key={i}
                className={`flex flex-row items-end justify-between gap-40 ${i !== 0 ? 'flex-wrap border-t pt-2' : ''}`}
              >
                <ShiftEditor
                  value={shift}
                  onChange={(newShift) =>
                    _setValue((val) => ({
                      ...val,
                      [day]: {
                        ...val[day],
                        shifts: val[day].shifts.map((s, idx) =>
                          idx === i ? newShift : shift
                        ),
                      },
                    }))
                  }
                />

                <Button
                  type={'button'}
                  variant='outline'
                  disabled={i === 0}
                  onClick={() =>
                    _setValue((val) => ({
                      ...val,
                      [day]: {
                        ...val[day],
                        shifts: val[day].shifts.filter(
                          (value, index) => index !== i
                        ),
                      },
                    }))
                  }
                  className={`border-destructive disabled:cursor-not-allowed`}
                >
                  <span className={'text-destructive'}>Remove Shift</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

OpenHoursEditor.displayName = 'OpenHoursEditor'

export {
  epochDate,
  Shift,
  defaultShift,
  OpenShift,
  defaultOpenShift,
  OpenHours,
  defaultOpenHours,
  days,
  daysLabel,
  OpenHoursEditorProps,
  OpenHoursEditor,
}
