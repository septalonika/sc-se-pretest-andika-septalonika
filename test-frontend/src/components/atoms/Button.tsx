import type { ComponentProps } from 'react'
import { Button as ShadcnButton } from '@/components/ui/button'

export function Button(props: ComponentProps<typeof ShadcnButton>) {
  return <ShadcnButton {...props} />
}
