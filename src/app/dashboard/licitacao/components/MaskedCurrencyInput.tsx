'use client'

import { NumericFormat } from 'react-number-format'

interface MaskedCurrencyInputProps {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

export default function MaskedCurrencyInput({
  value,
  onChange,
  disabled = false,
  className = '',
}: MaskedCurrencyInputProps) {
  return (
    <NumericFormat
      value={value}
      thousandSeparator='.'
      decimalSeparator=','
      prefix='R$ '
      allowNegative={false}
      disabled={disabled}
      placeholder='Valor'
      className={`border-2 rounded-md px-2 h-11 w-full ${className}`}
      onValueChange={(values) => {
        if (onChange) onChange(values.value)
      }}
    />
  )
}
