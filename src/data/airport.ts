import type { Source } from './meta'

export type AirportOption = {
  id: 'vy' | 'flytoget' | 'flybussen'
  name: string
  operator: string
  /** Typical journey time in minutes, used for sorting. */
  minutes: number
  minutesLabel: string
  frequency: string
  /** Approximate one-way adult price in NOK. Guides disagree by a few kroner, so it is shown as "about". */
  approxPriceNok: number
  whereToBuy: string
  goodToKnow: string
  source: Source
}

const GUIDE: Source = {
  label: 'Oslo Spirit airport guide',
  url: 'https://www.oslo-spirit.com/guides/oslo-airport-to-city/',
}

export const OSL_TO_CENTRE: AirportOption[] = [
  {
    id: 'vy',
    name: 'Regional train',
    operator: 'Vy',
    minutes: 23,
    minutesLabel: '≈ 23 min',
    frequency: 'About 3 trains an hour',
    approxPriceNok: 129,
    whereToBuy: 'Vy app, or a ticket machine at the station.',
    goodToKnow:
      'Almost the same trip as the express train, a few minutes slower, at about half the price. Trains stop at Oslo Central Station.',
    source: GUIDE,
  },
  {
    id: 'flytoget',
    name: 'Airport Express',
    operator: 'Flytoget',
    minutes: 19,
    minutesLabel: '19 min',
    frequency: 'Every 10 minutes',
    approxPriceNok: 260,
    whereToBuy: 'Flytoget app, their web shop, or machines.',
    goodToKnow: 'The fastest option and very regular. It costs roughly double the regional train.',
    source: { label: 'flytoget.no', url: 'https://flytoget.no/en/' },
  },
  {
    id: 'flybussen',
    name: 'Airport bus',
    operator: 'Flybussen',
    minutes: 55,
    minutesLabel: '50–60 min',
    frequency: 'Runs around the clock on most routes',
    approxPriceNok: 269,
    whereToBuy: 'Flybussen app or online.',
    goodToKnow:
      'Slowest and the most expensive, but useful late at night, or if your hotel is on a bus route rather than near a train.',
    source: GUIDE,
  },
]
