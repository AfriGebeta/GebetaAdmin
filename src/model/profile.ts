//@ts-nocheck
export const Role = {
  COLLECTOR: 'COLLECTOR',
  CROWD: 'CROWD',
  ADMIN: 'ADMIN',
}

export type Role = (typeof Role)[keyof typeof Role]

export interface Boundary {
  id: string
  bounds: Array<string>
  radius: number
  createdAt: string
  updatedAt: string
  centerId: string
  center: Location | null
}

export interface Profile {
  id: string
  role?: Role
  firstName: string
  lastName?: string
  phoneNumber: string
  email: string | null
  collectionBoundaryId: string
  collectionBoundary: Boundary
  createdAt: Date
  updatedAt: Date
}
