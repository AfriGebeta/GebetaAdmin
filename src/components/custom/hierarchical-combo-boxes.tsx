import { Fragment } from 'react'
import { Combobox } from '@/components/custom/combobox.tsx'
import {
  defaultLocale,
  IntlText,
  SupportedLocale,
} from '@/components/custom/intl-input-filed.tsx'

interface HierarchicalComboBoxesProps {
  locale: SupportedLocale
  optionsHierarchy: Array<{
    level: number
    enclosure: Record<
      string,
      Record<string, { label: IntlText; value: string }>
    >
  }>
  messages: Array<{
    level: number
    value?: {
      emptyMessage?: string
      placeholder?: string
      defaultMessage?: string
    }
  }>
  onChange: (values: { level: number; value: string }) => void
  values: Array<{ level: number; value?: string }>
  enclosureIdExtractor: (level: number) => string
  containerClasses?: string
}

const HierarchicalComboBoxes = function HeirarchicalComboboxes<T>({
  locale = defaultLocale,
  optionsHierarchy,
  messages,
  onChange,
  values = [],
  enclosureIdExtractor,
  containerClasses = '',
}: HierarchicalComboBoxesProps) {
  return (
    <div className={`${containerClasses}`}>
      {optionsHierarchy.map((options, index) => (
        <Fragment key={index}>
          <Combobox
            locale={locale}
            options={options.enclosure[enclosureIdExtractor(index)] ?? {}}
            value={values[index].value}
            onChange={(value) => onChange({ level: index, value: value })}
            placeholder={messages[index]?.value?.placeholder}
            defaultMessage={messages[index]?.value?.defaultMessage}
            emptyMessage={messages[index]?.value?.emptyMessage}
          />
        </Fragment>
      ))}
    </div>
  )
}

HierarchicalComboBoxes.displayName = 'HierarchicalComboBoxes'

export { HierarchicalComboBoxesProps, HierarchicalComboBoxes }
