import type { Source } from './meta'

export type PaySituation = {
  id: string
  label: string
  icon: 'bus' | 'shop' | 'coffee' | 'phone' | 'cash'
  headline: string
  works: string[]
  watchOut: string[]
  tip: string
  sources: Source[]
}

const CASH_SOURCE: Source = {
  label: 'Life in Norway: cash',
  url: 'https://www.lifeinnorway.net/norway-considers-forcing-businesses-to-accept-cash/',
}

export const PAY_SITUATIONS: PaySituation[] = [
  {
    id: 'transit',
    label: 'Bus, tram, metro',
    icon: 'bus',
    headline: 'Buy the ticket before you board.',
    works: [
      'The Ruter app, paying with your normal bank card.',
      'A reusable travel card (50 kr) from Narvesen, 7-Eleven or Mix, loaded with a ticket.',
    ],
    watchOut: [
      'Cash on board buses and boats only takes notes up to 200 kr, and costs more than the app.',
      'Vipps in the Ruter app needs a Norwegian bank account.',
    ],
    tip: 'Install the Ruter app before you land, and add your card on the hotel wifi.',
    sources: [{ label: 'Ruter: tourist tickets', url: 'https://ruter.no/en/about-our-tickets/tourist-ticket' }],
  },
  {
    id: 'shops',
    label: 'Shops & restaurants',
    icon: 'shop',
    headline: 'Tap your card. That is it.',
    works: [
      'Visa and Mastercard contactless, almost everywhere.',
      'Apple Pay and Google Pay, in most places.',
    ],
    watchOut: ['Some businesses refuse cash, so do not count on it.'],
    tip: 'There is no need to exchange money. Bring a card with no foreign fees.',
    sources: [{ label: 'The Norway Guide: payment methods', url: 'https://thenorwayguide.com/payment-methods/' }, CASH_SOURCE],
  },
  {
    id: 'kiosks',
    label: 'Kiosks & trail parking',
    icon: 'coffee',
    headline: 'The one place that can catch you out.',
    works: ['Most small kiosks and ticket machines take contactless cards.'],
    watchOut: [
      'A few remote spots take Vipps only, like some event coffee kiosks and unstaffed parking near popular trails.',
    ],
    tip: 'Look for a QR code and a card option before you commit. For parking, check whether a parking app such as EasyPark covers the area.',
    sources: [
      { label: 'Norway Explained: travel apps', url: 'https://norwayexplained.com/norwegian-travel-apps-tourists-need/' },
      {
        label: 'Tripadvisor Norway forum',
        url: 'https://www.tripadvisor.com/ShowTopic-g190455-i550-k13887401-Cashless_society_and_the_foreign_visitor-Norway.html',
      },
    ],
  },
  {
    id: 'vipps',
    label: 'Vipps',
    icon: 'phone',
    headline: 'Norway’s favourite payment app. Mostly not for visitors.',
    works: ['Locals use it for almost everything, so you will see its logo everywhere.'],
    watchOut: ['Signing up normally needs a Norwegian ID number, a Norwegian bank account and BankID.'],
    tip: 'Plan around it. Your card and phone wallet cover nearly everything.',
    sources: [
      { label: 'Norway Explained: Vipps for tourists', url: 'https://norwayexplained.com/how-to-get-vipps-as-a-tourist-in-norway/' },
    ],
  },
  {
    id: 'cash',
    label: 'Cash',
    icon: 'cash',
    headline: 'Nice as a backup, not a plan.',
    works: ['A little cash can help on some buses and boats.'],
    watchOut: ['Under 3% of transactions in Norway are in cash, and some businesses will not take it.'],
    tip: 'Skip the airport exchange desk. Use your card, and withdraw only if you need to.',
    sources: [CASH_SOURCE],
  },
]
