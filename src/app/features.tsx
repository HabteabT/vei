import { Compass, House, Luggage, Route, Wallet, type LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import { ExplorePage } from '../pages/app/ExplorePage'
import { GoPage } from '../pages/app/GoPage'
import { PayPage } from '../pages/app/PayPage'
import { TodayPage } from '../pages/app/TodayPage'
import { TripPage } from '../pages/app/TripPage'

export interface Feature {
  id: string
  /** Path under /app. Empty string is the app's home. */
  path: string
  label: string
  icon: LucideIcon
  element: ReactElement
  requiresAuth: boolean
}

/**
 * Every screen inside the app, in navigation order. To add a feature, add one entry here:
 * the router, the navigation and the sign-in guard all read from this list.
 * (The profile page is reached from the user menu, so it is routed separately.)
 */
export const FEATURES: Feature[] = [
  { id: 'today', path: '', label: 'Today', icon: House, element: <TodayPage />, requiresAuth: false },
  { id: 'go', path: 'go', label: 'Get around', icon: Route, element: <GoPage />, requiresAuth: false },
  { id: 'pay', path: 'pay', label: 'Pay & tickets', icon: Wallet, element: <PayPage />, requiresAuth: false },
  { id: 'explore', path: 'explore', label: 'Explore', icon: Compass, element: <ExplorePage />, requiresAuth: false },
  { id: 'trip', path: 'trip', label: 'My trip', icon: Luggage, element: <TripPage />, requiresAuth: true },
]
