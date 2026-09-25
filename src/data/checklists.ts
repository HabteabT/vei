import { ARRIVAL_CHECKLIST, type ChecklistItem } from '../domain/checklist'
import { getCity, type CityId } from './cities'

/** Oslo keeps the original arrival list. Other cities get the same jobs, with the local app. */
export function checklistFor(cityId: CityId): ChecklistItem[] {
  if (cityId === 'oslo') return ARRIVAL_CHECKLIST
  const city = getCity(cityId)
  if (!city) return ARRIVAL_CHECKLIST
  return [
    {
      id: 'local-app',
      title: `Install the ${city.transitApp} app`,
      hint: city.transitHint,
      to: '/app/pay?tab=tickets',
    },
    {
      id: 'backup-pay',
      title: 'Have a backup way to pay',
      hint: 'A bank card plus a phone wallet. Vipps needs a Norwegian bank account.',
      to: '/app/pay',
    },
    {
      id: 'airport-route',
      title: 'Pick your way from the airport',
      hint: `${city.airport} into ${city.name}.`,
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
      hint: 'Weather changes fast. Rainy days suit indoor places.',
    },
  ]
}
