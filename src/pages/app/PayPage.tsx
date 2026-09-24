import { Ticket, Wallet } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { PayGuide } from '../../components/PayGuide'
import { TicketHelper } from '../../components/TicketHelper'
import { Segmented } from '../../ui/Segmented'

type Tab = 'pay' | 'tickets'

export function PayPage() {
  const [params, setParams] = useSearchParams()
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
            : 'Three questions and you have an answer.'
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
      {tab === 'pay' ? <PayGuide /> : <TicketHelper />}
    </>
  )
}
