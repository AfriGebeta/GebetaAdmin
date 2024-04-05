//@ts-nocheck
import { createContext } from 'react'
import { OpenHours, Place } from '@/contexts/places-context.ts'

export const SearchedFrom = {
  TELEGRAM: 'TELEGRAM',
  WEB: 'WEB',
}

export type SearchedFrom = (typeof SearchedFrom)[keyof typeof SearchedFrom]

export const TelegramSearchMethod = {
  INLINE: 'INLINE',
  BOT_CHAT: 'BOT_CHAT',
  WEB_BOT: 'WEB_BOT',
  BOT_PAGINATION: 'BOT_PAGINATION',
  CHAT_SEARCH: 'CHAT_SEARCH',
}

export type TelegramSearchMethod =
  (typeof TelegramSearchMethod)[keyof typeof TelegramSearchMethod]

export interface PlaceSearchQuery {
  id: string
  query: string
  result: string[]
  from: SearchedFrom
  tgMethod: TelegramSearchMethod | null
  tgUserId: bigint | null
  tgChatId: bigint | null
  createdAt: Date
}

export const TransportationRouteType = {
  INTRA_CITY: 'INTRA_CITY',
  INTER_CITY: 'INTER_CITY',
  INTER_STATE: 'INTER_STATE',
}

export type TransportationRouteType =
  (typeof TransportationRouteType)[keyof typeof TransportationRouteType]

export const TransportationRouteVehicleType = {
  TAXI: 'TAXI',
  BUS: 'BUS',
  TRAIN: 'TRAIN',
  BICYCLE: 'BICYCLE',
  ON_FOOT: 'ON_FOOT',
}

export type TransportationRouteVehicleType =
  (typeof TransportationRouteVehicleType)[keyof typeof TransportationRouteVehicleType]

export interface TransportationRoute {
  id: string
  type: TransportationRouteType
  vehicleType: TransportationRouteVehicleType
  pillars: Array<string>
  stops: Array<string>
  averageWaitingTime: Array<{ from: string; to: string; value: number }>
  averageTravelTime: Array<{ from: string; to: string; value: number }>
  price: Array<{ from: string; to: string; value: number }>
  availableHours: OpenHours | null
  abandoned: boolean
  sourceId: string
  destinationId: string
  source: Place
  destination: Place
  createdAt: string
  updatedAt: string
}

export const TransportationRoutesContext = createContext({
  routes: {} as { [placeId: string]: TransportationRoute },
  setRoutes: (
    //@ts-nocheck
    routes: { [routeId: string]: TransportationRoute }
  ) => {},
  //@ts-nocheck
  addRoute: (route: TransportationRoute) => {},
  //@ts-nocheck
  removeRoute: (routeId: string) => {},
  //@ts-nocheck
  removeRoutes: (routeIds: Array<string>) => {},
})
