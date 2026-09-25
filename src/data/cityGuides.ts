import type { Source } from './meta'
import type { CityId } from './cities'

export interface CityRide {
  id: string
  name: string
  operator: string
  /** Journey time as published. "Check the timetable" when no public minute count was found. */
  minutesLabel: string
  frequency: string
  /** Short label for the row, such as "1 zone" or "≈ 51 kr". */
  priceShort: string
  priceLabel: string
  where: string
  getOff: string
  buy: string
  goodToKnow: string
  sources: Source[]
}

export interface CityGuide {
  cityId: Exclude<CityId, 'oslo'>
  rides: CityRide[]
  tickets: { summary: string; steps: string[]; source: Source }
}

const AKT: Source = {
  label: 'AKT: airport buses',
  url: 'https://www.akt.no/english/travel-planning/airport-buses/',
}
const SKYSS: Source = {
  label: 'Skyss: airports',
  url: 'https://www.skyss.no/en/travel/Airports/',
}
const VISIT_BERGEN: Source = {
  label: 'Visit Bergen: airport to city centre',
  url: 'https://en.visitbergen.com/visitor-information/travel-information/getting-here/to-bergen-by-plane/bergen-airport-flesland-to-bergen-city-center',
}
const FLYBUSSEN: Source = {
  label: 'Flybussen Stavanger',
  url: 'https://www.flybussen.no/en/airports/stavanger-airport/',
}
const FJORD: Source = {
  label: 'Fjord Norway: Flybussen Stavanger',
  url: 'https://www.fjordnorway.com/en/transport/airport-shuttle-flybussen-stavanger',
}
const VISIT_STAVANGER: Source = {
  label: 'Visit Norway: the Stavanger region',
  url: 'https://www.visitnorway.com/places-to-go/fjord-norway/the-stavanger-region/',
}

/**
 * Airport-to-centre guides for the cities that are not Oslo.
 * Oslo keeps its own sourced comparison in airport.ts.
 * Prices are omitted when the operator page does not publish a number we have read.
 */
export const CITY_GUIDES: CityGuide[] = [
  {
    cityId: 'kristiansand',
    rides: [
      {
        id: 'akt-35',
        name: 'Local bus, lines 35 and 36',
        operator: 'Agder kollektivtrafikk (AKT)',
        minutesLabel: 'Check the timetable',
        frequency: 'Line 35 is the regular bus. Line 36 stops at the airport on some departures.',
        priceShort: '1 zone',
        priceLabel: 'Ordinary AKT ticket, 1 zone. Confirm the price in the app.',
        where: 'Platform B, outside the domestic terminal.',
        getOff: 'Kristiansand bus station (rutebilstasjon).',
        buy: 'Buy an ordinary AKT ticket in the AKT Reise app before you board.',
        goodToKnow: 'This is a normal local bus. It follows a timetable and does not wait if your flight is late.',
        sources: [AKT],
      },
    ],
    tickets: {
      summary: 'City buses in Kristiansand use AKT tickets. The airport ride is 1 zone.',
      steps: [
        'Open the AKT Reise app and buy the ticket before you board.',
        'From Kjevik, wait at platform B for line 35, or a line 36 departure that stops there.',
        'Get off at Kristiansand bus station.',
        'The same app covers other local buses. Confirm the zone and the price before you pay.',
      ],
      source: AKT,
    },
  },
  {
    cityId: 'bergen',
    rides: [
      {
        id: 'bybanen',
        name: 'Light rail, line 1',
        operator: 'Skyss (Bybanen)',
        minutesLabel: 'About 45 min',
        frequency: 'Runs between the airport and the city centre.',
        priceShort: '≈ 51 kr',
        priceLabel: 'About 51 kr for an adult. Free with the Bergen Card.',
        where: 'The line 1 platform is at the airport terminal.',
        getOff: 'Ride towards the centre. Byparken is the city-centre end. The train also stops at Bergen bus station.',
        buy: 'Ticket machine on the platform, or the Skyss ticket app. Buy before you board.',
        goodToKnow: 'Visit Bergen lists this as the cheapest public option, and up to 4 children can ride on an adult ticket. Confirm the fare in the app. Skyss confirms that line 1 runs between the airport and the centre.',
        sources: [VISIT_BERGEN, SKYSS],
      },
      {
        id: 'flybussen-bergen',
        name: 'Airport coach',
        operator: 'Flybussen',
        minutesLabel: 'About 30 min',
        frequency: 'A coach between the airport and the city centre.',
        priceShort: '≈ 189 kr',
        priceLabel: 'About 189 kr. Buying on board costs extra.',
        where: 'Airport coach stop at Flesland. Skyss lists it next to the light rail.',
        getOff: 'City-centre stops include Bryggen on some routes. Check the board at the stop.',
        buy: 'Buy on flybussen.no before you travel. On-board tickets cost more.',
        goodToKnow: 'Faster than the light rail, and a separate ticket from Skyss.',
        sources: [VISIT_BERGEN, SKYSS],
      },
    ],
    tickets: {
      summary: 'Light rail and local buses are Skyss. The airport coach is Flybussen, with its own ticket.',
      steps: [
        'For the light rail, buy in the Skyss app or at the platform machine before you board.',
        'A Bergen Card covers the light rail and Skyss buses. Check what your card includes.',
        'Flybussen is not a Skyss ticket. Buy it on flybussen.no.',
        'Prices above are about, from Visit Bergen. Confirm them before you pay.',
      ],
      source: SKYSS,
    },
  },
  {
    cityId: 'stavanger',
    rides: [
      {
        id: 'flybussen-stavanger',
        name: 'Airport shuttle',
        operator: 'Flybussen',
        minutesLabel: 'About 25–30 min',
        frequency: 'About every 20 minutes.',
        priceShort: '≈ 279 kr',
        priceLabel: 'About 279 kr online for an adult on the shared Flybussen price list. Confirm the Stavanger fare before you pay.',
        where: 'Just outside the terminal’s main entrance.',
        getOff: 'Stavanger bus and train station, where local buses and trains connect.',
        buy: 'The best price is online at flybussen.no. You can also buy on board.',
        goodToKnow:
          'About 25–30 minutes and about every 20 minutes, as described by Fjord Norway. A Flybussen ticket from the airport can include a free Kolumbus transfer for 1.5 hours in Stavanger, Sandnes, Sola, Randaberg, Rennesøy, and Ålgård. Read the current terms before you rely on that.',
        sources: [FLYBUSSEN, FJORD],
      },
    ],
    tickets: {
      summary: 'The airport shuttle is Flybussen. Local buses are Kolumbus, with a separate ticket.',
      steps: [
        'Buy the airport shuttle at flybussen.no. Check the live Stavanger price there.',
        'Get off at the bus and train station.',
        'For city buses, use the Kolumbus app.',
        'Visit Norway confirms an airport shuttle links Sola and the centre, and that Kolumbus runs the local buses.',
      ],
      source: VISIT_STAVANGER,
    },
  },
]

export function guideFor(cityId: CityId): CityGuide | undefined {
  return CITY_GUIDES.find((guide) => guide.cityId === cityId)
}
