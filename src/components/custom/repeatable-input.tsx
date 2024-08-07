import { useEffect, useState, memo, Fragment } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Label } from '@/components/ui/label.tsx'
import {
  IntlText,
  SupportedLocale,
} from '@/components/custom/intl-input-filed.tsx'

interface RepeatableInputProps<T> {
  values: Array<T>
  onChange: (value: Array<T>) => void
  defaultEntry: T
  header: string
  placeHolderExtractor: (index: number) => IntlText
  renderField: (placeHolder: IntlText, value: T, onChange: (T) => void) => void
  containerClasses?: string
  headerClasses?: string
  contentWrapperClasses?: string
}

const RepeatableInput = memo(function RepeatableInput<T>({
  value,
  onChange,
  defaultEntry,
  header,
  placeHolderExtractor = (i) => ({
    [SupportedLocale.EN_US]: String(i),
    [SupportedLocale.AM]: String(i),
  }),
  renderField,
  containerClasses = '',
  headerClasses = '',
  contentWrapperClasses = '',
}: RepeatableInputProps<T>) {
  const [_value, _setValue] = useState<Array<T>>(value)

  useEffect(() => {
    onChange(_value)
  }, [_value])

  function renderFieldWrapper(v: T, i: number) {
    return renderField(placeHolderExtractor(i), v, (value) => {
      _setValue((val) => val.map((item, index) => (index === i ? value : item)))
    })
  }

  return (
    <div className={`flex flex-col gap-4 ${containerClasses}`}>
      <div
        className={`flex w-full flex-row items-center justify-between gap-4 ${headerClasses}`}
      >
        <Label>{header}</Label>

        <Button
          type={'button'}
          variant='ghost'
          onClick={() => _setValue((val) => [...val, defaultEntry])}
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {_value.length > 0 && (
        <div className={`flex flex-1 flex-col gap-2 ${contentWrapperClasses}`}>
          {_value.map((v, i, arr) => (
            <Fragment key={i}>
              {
                <div className={`flex flex-row justify-between gap-2`}>
                  {renderFieldWrapper(v, i)}

                  <Button
                    type={'button'}
                    variant='ghost'
                    onClick={() =>
                      _setValue((val) =>
                        val.filter((value, index) => index !== i)
                      )
                    }
                  >
                    <Minus className='h-4 w-4 text-destructive' />
                  </Button>
                </div>
              }
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
})

RepeatableInput.displayName = 'RepeatableInput'

export { RepeatableInputProps, RepeatableInput }
