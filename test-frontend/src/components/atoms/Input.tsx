import { Input as ShadcnInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface NumericInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  min: number
  max: number
  invalid?: boolean
}

export function Input({ id, value, onChange, onBlur, min, max, invalid }: NumericInputProps) {
  return (
    <ShadcnInput
      id={id}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      step={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      aria-invalid={invalid}
      className={cn('w-24', invalid && 'border-red-500 focus-visible:ring-red-500')}
    />
  )
}
