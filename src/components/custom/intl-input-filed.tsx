//@ts-nocheck

import { FC, useEffect, useState, memo } from 'react'
import { LanguagesIcon } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'

const SupportedLocale = {
  EN_US: 'EN',
  AM: 'AM',
}

type SupportedLocale = (typeof SupportedLocale)[keyof typeof SupportedLocale]

const defaultLocale = SupportedLocale.EN_US

const supportedLocaleList = Object.values(SupportedLocale)

const SupportedLocaleLabel: Record<
  SupportedLocale,
  { label: string; nativeLabel: string }
> = {
  [SupportedLocale.EN_US]: { label: 'En', nativeLabel: 'En' },
  [SupportedLocale.AM]: { label: 'Am', nativeLabel: 'አማ' },
}

interface IntlText {
  [key: SupportedLocale]: string
}

const defaultIntlText = {
  [SupportedLocale.EN_US]: '',
  [SupportedLocale.AM]: '',
}

function getIntlValue(text: IntlText, locale: SupportedLocale) {
  const tmp = text[locale]
  return tmp ? tmp : text[defaultLocale]
}

interface IntlInputFiledProps {
  value: IntlText
  onChange: (value: IntlText) => void
  containerClasses?: string
  inputsContainerClasses?: string
  controlsContainerClasses?: string
  placeHolder: IntlText
}

const IntlInputFiled: FC<IntlInputFiledProps> = memo(function IntlInputFiled({
  value = defaultIntlText,
  onChange,
  placeHolder = defaultIntlText,
  containerClasses = '',
  inputsContainerClasses = '',
  controlsContainerClasses = '',
}) {
  const [_value, _setValue] = useState(value)

  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    onChange(_value)
  }, [_value])

  return (
    <div className={`flex flex-row gap-4 ${containerClasses}`}>
      <div className={`flex flex-1 flex-col gap-2 ${inputsContainerClasses}`}>
        {supportedLocaleList.map(
          (v, i) =>
            (i === 0 || (showAll && i > 0)) && (
              <div key={i} className='flex flex-1 flex-row items-center gap-4'>
                <Label className='min-w-[1.5rem] text-base'>
                  {SupportedLocaleLabel[v].nativeLabel}
                </Label>

                <Input
                  placeholder={placeHolder[v]}
                  value={_value[v]}
                  onChange={(e) =>
                    _setValue((val) => ({ ...val, [v]: e.target.value }))
                  }
                />
              </div>
            )
        )}
      </div>

      <div className={controlsContainerClasses}>
        <Button
          type={'button'}
          variant='outline'
          onClick={() => setShowAll(!showAll)}
        >
          <LanguagesIcon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
})

IntlInputFiled.displayName = 'IntlInputField'

export {
  SupportedLocale,
  defaultLocale,
  supportedLocaleList,
  SupportedLocaleLabel,
  IntlText,
  defaultIntlText,
  getIntlValue,
  IntlInputFiledProps,
  IntlInputFiled,
}
