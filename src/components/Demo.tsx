import { useRef, useState, type ComponentType, type KeyboardEvent } from 'react'
import { ArriveTab } from './app/ArriveTab'
import { ExploreTab } from './app/ExploreTab'
import { PayTab } from './app/PayTab'
import { TicketsTab } from './app/TicketsTab'
import { Icon, type IconName } from './Icon'

const TABS: { id: string; label: string; icon: IconName; view: ComponentType }[] = [
  { id: 'arrive', label: 'Arrive', icon: 'plane', view: ArriveTab },
  { id: 'pay', label: 'Pay', icon: 'card', view: PayTab },
  { id: 'tickets', label: 'Tickets', icon: 'ticket', view: TicketsTab },
  { id: 'explore', label: 'Explore', icon: 'compass', view: ExploreTab },
]

const RULES: { icon: IconName; title: string; text: string }[] = [
  { icon: 'eye', title: 'Every fact shows its source', text: 'Tap the links. If we cannot source something, we leave it out.' },
  { icon: 'clock', title: 'Prices say when they were checked', text: 'Fares change, so we show “about” and remind you to confirm.' },
  { icon: 'shield', title: 'Nothing about you is stored', text: 'No account, no tracking. Live train times are fetched only when you tap for them.' },
]

function VeiApp() {
  const [active, setActive] = useState(TABS[0].id)
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const Current = TABS.find((t) => t.id === active)?.view ?? ArriveTab

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.findIndex((t) => t.id === active)
    let next = i
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length
    else return
    e.preventDefault()
    setActive(TABS[next].id)
    refs.current[TABS[next].id]?.focus()
  }

  return (
    <div className="phone__screen">
      <div className="app__head">
        <span className="app__title">vei</span>
        <span className="app__place">
          <Icon name="pin" /> Oslo
        </span>
      </div>

      <div className="app__body" role="tabpanel" id="panel" aria-labelledby={`tab-${active}`} tabIndex={0}>
        <Current />
      </div>

      <div className="tabbar" role="tablist" aria-label="Vei sections" onKeyDown={onKey}>
        {TABS.map((t) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el
            }}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            className="tab"
            aria-selected={t.id === active}
            aria-controls="panel"
            tabIndex={t.id === active ? 0 : -1}
            onClick={() => setActive(t.id)}
          >
            <Icon name={t.icon} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Demo() {
  return (
    <section className="section section--alt" id="try">
      <div className="container demo">
        <div className="demo__copy">
          <p className="kicker reveal">Try it</p>
          <h2 className="reveal">Oslo, your first 24 hours.</h2>
          <p className="section__intro reveal">
            This is a working prototype of the first version. Tap through it like a visitor who just landed at Gardermoen.
          </p>
          <ul className="rules reveal">
            {RULES.map((r) => (
              <li key={r.title}>
                <span className="badge">
                  <Icon name={r.icon} />
                </span>
                <div>
                  <strong>{r.title}</strong>
                  <span>{r.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="phone reveal" style={{ ['--d' as string]: '0.1s' }}>
          <VeiApp />
        </div>
      </div>
    </section>
  )
}
