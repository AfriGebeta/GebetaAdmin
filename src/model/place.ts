//@ts-nocheck
import { Profile } from '@/model'

export const PlaceType = {
  DWELLING: 'DWELLING',
  BANK: 'BANK',
  SUPERMARKET: 'SUPERMARKET',
  HOSPITAL: 'HOSPITAL',
  CLINIC: 'CLINIC',
  PHARMACY: 'PHARMACY',
  SCHOOL: 'SCHOOL',
  RESTAURANT: 'RESTAURANT',
  PARK: 'PARK',
  OFFICE: 'OFFICE',
  TRANSPORTATION_STATION: 'TRANSPORTATION_STATION',
  OTHER: 'OTHER',
}

export type PlaceType = (typeof PlaceType)[keyof typeof PlaceType]

export const PlaceStatus = {
  PENDING: 'PENDING',
  CHANGE_REQUESTED: 'CHANGE_REQUESTED',
  APPROVED: 'APPROVED',
}

export type PlaceStatus = (typeof PlaceStatus)[keyof typeof PlaceStatus]

export interface OpenHours {
  monday: { open: boolean; shifts: Array<Array<number>> }
  tuesday: { open: boolean; shifts: Array<Array<number>> }
  wednesday: { open: boolean; shifts: Array<Array<number>> }
  thursday: { open: boolean; shifts: Array<Array<number>> }
  friday: { open: boolean; shifts: Array<Array<number>> }
  saturday: { open: boolean; shifts: Array<Array<number>> }
  sunday: { open: boolean; shifts: Array<Array<number>> }
}

export interface Entity {
  id: string
  name: { [languageCode: string]: string }
  type: PlaceType
  openHours: OpenHours
  createdAt: string
  updatedAt: string
  contactId: string
  contact: Contact
}

export interface Address {
  id: string
  country: string
  province: string
  county: string
  municipality: string
  borough: string | null
  district: string | null
  village: string | null
  street: string | null
  block: string | null
  houseNumber: string | null
  createdAt: string
  updatedAt: string
}

export interface Location {
  id: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
}

export const FacebookAccountType = {
  GROUP: 'GROUP',
  PAGE: 'PAGE',
}

export type FacebookAccountType =
  (typeof FacebookAccountType)[keyof typeof FacebookAccountType]

export const MessagingPlatformAccountType = {
  GROUP: 'GROUP',
  CHANNEL: 'CHANNEL',
  BOT: 'BOT',
  PERSONAL: 'PERSONAL',
}

export type MessagingPlatformAccountType =
  (typeof MessagingPlatformAccountType)[keyof typeof MessagingPlatformAccountType]

export interface Contact {
  id: string
  phone: { primary: string; alternatives: Array<string> }
  email: { primary: string; alternatives: Array<string> }
  socialMedia: {
    website: string
    facebook: Array<{ type: FacebookAccountType; handle: string }>
    telegram: Array<{ type: MessagingPlatformAccountType; handle: string }>
    whatsapp: Array<{ type: MessagingPlatformAccountType; handle: string }>
    x: Array<string>
    instagram: Array<string>
  }
  createdAt: string
  updatedAt: string
}

export interface RelativeLocationSituation {
  LEFT_OF
  RIGHT_OF
  IN_FRONT_OF
  BEHIND
}

export interface Names {
  official: { [languageCode: string]: string }
  special: [{ [languageCode: string]: string }]
}

export interface RelativeLocation {
  situation: RelativeLocationSituation
  place: { [languageCode: String]: String }
}

export interface Place {
  id: string
  names: Names
  collectedNames: string
  type: PlaceType
  customType: string | null
  images: string[]
  status: PlaceStatus
  openHours: OpenHours | null
  relativeLocation: Array<RelativeLocation>
  createdAt: string
  updatedAt: string
  locationId: string
  addressId: string
  contactId: string | null
  addedById: string
  approvedById: string | null
  entityId: string | null
  location: Location
  address: Address | null
  addedBy: Profile
  approvedBy: Profile
  entity: Entity | null
  contact: Contact | null
}
