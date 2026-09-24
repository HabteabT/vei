export interface ChecklistItem {
  id: string
  title: string
  hint: string
  /** In-app link that helps with this step. */
  to?: string
}

/** Things worth doing before or just after landing. No prices, so nothing here goes out of date. */
export const ARRIVAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'ruter-app',
    title: 'Install the Ruter app and add your card',
    hint: 'Tickets bought before boarding are cheaper than paying on board.',
    to: '/app/pay',
  },
  {
    id: 'backup-pay',
    title: 'Have a backup way to pay',
    hint: 'A bank card plus a phone wallet. Vipps needs a Norwegian bank account.',
    to: '/app/pay',
  },
  {
    id: 'ticket-plan',
    title: 'Decide: single tickets or the Oslo Pass',
    hint: 'Three questions and you have an answer.',
    to: '/app/pay?tab=tickets',
  },
  {
    id: 'airport-route',
    title: 'Pick your way from the airport',
    hint: 'Regional train, Airport Express or bus.',
    to: '/app/go',
  },
  {
    id: 'offline',
    title: 'Save your hotel address for offline use',
    hint: 'Roaming can be patchy. Screenshot the address and directions.',
  },
  {
    id: 'weather',
    title: 'Check the forecast and pack a rain layer',
    hint: 'Weather changes fast. Rainy days suit the museums.',
  },
]
