import { Compass, Route, Sparkles, Ticket, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../app/auth'
import { Checklist } from '../../components/Checklist'
import { LiveTrains } from '../../components/LiveTrains'
import { PageHeader } from '../../components/PageHeader'
import { WeatherCard } from '../../components/WeatherCard'
import { greeting, osloHour } from '../../domain/time'
import { LinkButton } from '../../ui/Button'

const QUICK = [
  { to: '/app/go', label: 'Airport to city', icon: Route },
  { to: '/app/pay', label: 'How to pay', icon: Wallet },
  { to: '/app/pay?tab=tickets', label: 'Which ticket?', icon: Ticket },
  { to: '/app/explore', label: 'What to do', icon: Compass },
] as const

export function TodayPage() {
  const { user } = useAuth()
  const first = user?.name.split(' ')[0]
  const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Oslo' })

  return (
    <>
      <PageHeader
        eyebrow={date}
        title={`${greeting(osloHour())}${first ? `, ${first}` : ''}`}
        subtitle="What matters for your first hours in Oslo."
      />

      {!user && (
        <div className="banner">
          <Sparkles aria-hidden="true" />
          <p>
            You are browsing as a guest. <Link to="/signup">Create a free account</Link> to save places and plan your trip.
          </p>
          <LinkButton to="/login" size="sm" variant="secondary">
            Sign in
          </LinkButton>
        </div>
      )}

      <div className="quick">
        {QUICK.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="quick__tile card card--interactive">
            <span className="quick__icon">
              <Icon aria-hidden="true" />
            </span>
            {label}
          </Link>
        ))}
      </div>

      <div className="grid2">
        <WeatherCard />
        <section className="card card--pad tile" aria-labelledby="next-trains">
          <h2 id="next-trains" className="tile__title">
            Next trains from the airport
          </h2>
          <LiveTrains limit={3} />
        </section>
      </div>

      <Checklist />
    </>
  )
}
