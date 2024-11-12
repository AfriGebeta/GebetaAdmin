//@ts-nocheck
export const Role = {
  COLLECTOR: 'COLLECTOR',
  CROWD: 'CROWD',
  ADMIN: 'ADMIN',
}

export type Role = (typeof Role)[keyof typeof Role]

export interface Profile {
  id: string
  name: string
  phone: string
  email: string | null
  purchased_date: string
}
