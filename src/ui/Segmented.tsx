import type { LucideIcon } from 'lucide-react'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
}

/** A row of toggle buttons where exactly one is selected. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  block,
}: {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  block?: boolean
}) {
  return (
    <div className={`seg ${block ? 'seg--block' : ''}`} role="group" aria-label={label}>
      {options.map(({ value: v, label: text, icon: Icon }) => (
        <button key={v} type="button" className="seg__btn" aria-pressed={v === value} onClick={() => onChange(v)}>
          {Icon && <Icon aria-hidden="true" />}
          {text}
        </button>
      ))}
    </div>
  )
}
