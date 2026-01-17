//@ts-nocheck
export const Role = {
  COLLECTOR: 'COLLECTOR',
  CROWD: 'CROWD',
  ADMIN: 'ADMIN',
}

export type Role = (typeof Role)[keyof typeof Role]

export interface Token {
  id: string
  token: string
  tokenType: string
  scope: string[]
  legacy: boolean
  revoked: boolean
  createdAt: string
  updatedAt: string
}

export interface Profile {
  id: string
  name: string
  phone: string
  email: string | null
  purchased_date: string
  token?: Token[]
  allowed_scopes?: string[]
  username?: string
}
