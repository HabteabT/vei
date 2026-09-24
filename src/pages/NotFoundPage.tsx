import { Compass } from 'lucide-react'
import { LinkButton } from '../ui/Button'
import { EmptyState } from '../ui/Feedback'
import { Logo } from '../ui/Logo'

export function NotFoundPage() {
  return (
    <div className="notfound container">
      <Logo />
      <EmptyState
        icon={Compass}
        title="This road goes nowhere"
        action={
          <LinkButton to="/">Back to Vei</LinkButton>
        }
      >
        We could not find that page. The link may be old or mistyped.
      </EmptyState>
    </div>
  )
}
