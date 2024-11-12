export interface Bundle {
  id: string
  includedCallTypes: string[]
  name: string
  rate: number
  price: number
  expiration: string
  callCaps: number[]
  expiredIn: number
}
