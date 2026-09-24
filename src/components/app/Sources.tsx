import type { Source } from '../../data/meta'

export function Sources({ items }: { items: Source[] }) {
  return (
    <div className="links">
      {items.map((s) => (
        <a key={s.url} className="link" href={s.url} target="_blank" rel="noreferrer">
          {s.label} ↗
        </a>
      ))}
    </div>
  )
}
