export interface User {
  id: string
  email: string
  name: string
  createdAt: number
}

export type Interest = 'art' | 'history' | 'nature' | 'food' | 'family'
export type Budget = 'low' | 'mid' | 'high'

export interface Preferences {
  interests: Interest[]
  budget: Budget | null
}

export type TripSlot = 'morning' | 'afternoon' | 'evening' | 'anytime'

export interface TripItem {
  id: string
  title: string
  /** Set when the item came from the Explore list. */
  placeId: string | null
  slot: TripSlot
  note: string
  createdAt: number
}

export const TRIP_SLOTS: { id: TripSlot; label: string }[] = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
  { id: 'anytime', label: 'Anytime' },
]

export const INTERESTS: { id: Interest; label: string }[] = [
  { id: 'art', label: 'Art & design' },
  { id: 'history', label: 'History' },
  { id: 'nature', label: 'Nature' },
  { id: 'food', label: 'Food' },
  { id: 'family', label: 'Family' },
]

export const BUDGETS: { id: Budget; label: string; hint: string }[] = [
  { id: 'low', label: 'Keep it cheap', hint: 'Free things and simple food' },
  { id: 'mid', label: 'Balanced', hint: 'A mix of paid and free' },
  { id: 'high', label: 'Treat myself', hint: 'Comfort over cost' },
]
