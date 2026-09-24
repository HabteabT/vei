import { useState } from 'react'
import { PAY_SITUATIONS } from '../../data/payments'
import { Icon } from '../Icon'
import { Sources } from './Sources'

export function PayTab() {
  const [id, setId] = useState(PAY_SITUATIONS[0].id)
  const current = PAY_SITUATIONS.find((s) => s.id === id) ?? PAY_SITUATIONS[0]

  return (
    <div className="panel">
      <h3>How do I pay?</h3>
      <p className="app__sub">Pick where you are standing.</p>

      <div className="chips" role="group" aria-label="Where are you paying?">
        {PAY_SITUATIONS.map((s) => (
          <button key={s.id} type="button" className="pill" aria-pressed={s.id === id} onClick={() => setId(s.id)}>
            <Icon name={s.icon} />
            {s.label}
          </button>
        ))}
      </div>

      <div className="answer" key={current.id}>
        <h4>{current.headline}</h4>

        <div className="label">Works</div>
        <ul className="list list--ok">
          {current.works.map((w) => (
            <li key={w}>
              <Icon name="check" />
              <span>{w}</span>
            </li>
          ))}
        </ul>

        <div className="label">Watch out</div>
        <ul className="list list--no">
          {current.watchOut.map((w) => (
            <li key={w}>
              <Icon name="alert" />
              <span>{w}</span>
            </li>
          ))}
        </ul>

        <p className="tip">
          <b>Tip:</b> {current.tip}
        </p>
        <Sources items={current.sources} />
      </div>
    </div>
  )
}
