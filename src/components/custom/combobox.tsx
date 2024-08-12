//@ts-nocheck
import { useEffect, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx'
import { cn } from '@/lib/utils.ts'
import {
  defaultLocale,
  getIntlValue,
  IntlText,
  SupportedLocale,
} from '@/components/custom/intl-input-filed.tsx'

interface ComboboxProps {
  locale: SupportedLocale
  options: Record<string, { value: string; label: IntlText }>
  onChange: (value: string) => void
  value: string
  emptyMessage?: string
  placeholder?: string
  defaultMessage?: string
}

const Combobox = function Combobox({
  locale = defaultLocale,
  options,
  onChange,
  value = '',
  emptyMessage = 'No options found',
  placeholder = 'Search options...',
  defaultMessage = 'Select option...',
}: ComboboxProps) {
  const [open, setOpen] = useState(false)

  const [_value, _setValue] = useState(value)

  useEffect(() => {
    onChange(_value)
  }, [_value])

  useEffect(() => {
    _setValue(value)
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between'
        >
          {_value
            ? getIntlValue(options[_value]?.label ?? {}, locale)
            : defaultMessage}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {Object.values(options).map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    _setValue(currentValue === _value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      _value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {getIntlValue(option.label, locale)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { ComboboxProps, Combobox }
