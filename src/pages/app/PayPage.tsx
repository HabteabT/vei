import { Ticket, Wallet } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useCity } from '../../app/hooks'
import { CityTickets } from '../../components/CityTickets'
import { PageHeader } from '../../components/PageHeader'
import { PayGuide } from '../../components/PayGuide'
import { TicketHelper } from '../../components/TicketHelper'
import { Segmented } from '../../ui/Segmented'

type Tab = 'pay' | 'tickets'

export function PayPage() {
  const [params, setParams] = useSearchParams()
  const [city] = useCity()
  const tab: Tab = params.get('tab') === 'tickets' ? 'tickets' : 'pay'
  const setTab = (next: Tab) => setParams(next === 'pay' ? {} : { tab: next }, { replace: true })

  return (
    <>
      <PageHeader
        eyebrow="Pay & tickets"
        title={tab === 'pay' ? 'How do I pay?' : 'Which ticket?'}
        subtitle={
          tab === 'pay'
            ? 'Norway is almost cashless. Pick where you are standing.'
            : city.id === 'oslo'
              ? 'Three questions and you have an answer.'
              : `Where to buy a ticket in ${city.name}.`
        }
        actions={
          <Segmented
            label="Choose a view"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'pay', label: 'How to pay', icon: Wallet },
              { value: 'tickets', label: 'Which ticket', icon: Ticket },
            ]}
          />
        }
      />
      {tab === 'pay' ? <PayGuide /> : city.id === 'oslo' ? <TicketHelper /> : <CityTickets city={city} />}
    </>
  )
}
