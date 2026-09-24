import { ExternalLink } from 'lucide-react'
import type { Source } from '../data/meta'

export function SourceLinks({ items }: { items: Source[] }) {
  return (
    <div className="sources">
      {items.map((s) => (
        <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
          {s.label}
          <ExternalLink aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}
