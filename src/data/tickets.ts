import type { Source } from './meta'

export type Stay = 'day' | 'short' | 'long'
export type Museums = 'few' | 'some' | 'many'
export type Rides = 'few' | 'many'

export type Answers = { stay: Stay; museums: Museums; rides: Rides }

export type Recommendation = {
  badge: string
  title: string
  why: string
  steps: string[]
  sources: Source[]
}

/** Adult Oslo Pass prices in NOK, as listed by Visit Oslo. */
export const OSLO_PASS_NOK = { h24: 580, h48: 845, h72: 995 } as const

const OSLO_PASS: Source = {
  label: 'Oslo Pass prices (Visit Oslo)',
  url: 'https://www.visitoslo.com/activities-and-attractions/oslo-pass/prices',
}
const RUTER: Source = { label: 'Ruter: tourist tickets', url: 'https://ruter.no/en/about-our-tickets/tourist-ticket' }

/**
 * Plain rules of thumb, not a price calculator: official fares are published as PDFs and change.
 * Every result tells the visitor to confirm the price in the app before paying.
 */
export function recommend({ stay, museums, rides }: Answers): Recommendation {
  const passLength = stay === 'day' ? '24-hour' : stay === 'short' ? '48 or 72-hour' : '72-hour'

  if (museums === 'many') {
    return {
      badge: 'Likely worth it',
      title: `Oslo Pass (${passLength})`,
      why: 'You plan several museums, and the pass covers 30+ of them plus public transport.',
      steps: [
        `Adult prices are ${OSLO_PASS_NOK.h24} / ${OSLO_PASS_NOK.h48} / ${OSLO_PASS_NOK.h72} NOK for 24 / 48 / 72 hours.`,
        'Add up the entry fees of what you really plan to visit. If the total is close to the pass price, the pass is a safe choice.',
        'The pass starts when you activate it, so activate it on your first museum morning, not on arrival day.',
      ],
      sources: [OSLO_PASS],
    }
  }

  if (museums === 'some') {
    return {
      badge: 'Do the sum',
      title: 'Compare the Oslo Pass with tickets in the Ruter app',
      why: 'Two or three museums can go either way, depending on which ones and how much you ride.',
      steps: [
        `Oslo Pass adult: ${OSLO_PASS_NOK.h24} NOK for 24 hours, ${OSLO_PASS_NOK.h48} NOK for 48.`,
        'Add the entry fees of your museums, then add your transport tickets from the Ruter app.',
        'If that total is above the pass price, buy the pass.',
      ],
      sources: [OSLO_PASS, RUTER],
    }
  }

  if (rides === 'many' || stay === 'long') {
    return {
      badge: 'Simple and cheap',
      title: stay === 'long' ? 'A 24-hour or 7-day ticket in the Ruter app' : 'A 24-hour ticket in the Ruter app',
      why:
        stay === 'long'
          ? 'Few museums and a longer stay means a time-based transport ticket beats the Oslo Pass.'
          : 'You will ride a lot, so one ticket for the whole day is easier than many single tickets.',
      steps: [
        'As a rule of thumb, a 24-hour ticket pays off once you would otherwise buy about four single tickets. Check current prices in the app.',
        'Buying in the app is cheaper than at a machine or on board.',
      ],
      sources: [RUTER],
    }
  }

  return {
    badge: 'Keep it simple',
    title: 'Single tickets in the Ruter app',
    why: 'A few rides and hardly any museums. You do not need a pass.',
    steps: [
      'A single ticket is valid for 60 minutes including transfers.',
      'Buy before you board. The app is cheaper than a machine or paying on board.',
    ],
    sources: [RUTER],
  }
}
