export default {
  async signIn(data: { phoneNumber: string; password: string }) {
    return await fetch(`${import.meta.env['VITE_API_BASE_URL']}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        phoneNumber: `+251${data.phoneNumber.replace(/\D/g, '')}`,
      }),
    })
  },
  async logout({ apiAccessToken }: { apiAccessToken: string }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { ['Authorization']: `Bearer ${apiAccessToken}` },
    })
  },
  async getPlaces({
    apiAccessToken,
    offset = 0,
    limit = 10,
    searchString,
    orderBy,
  }: {
    apiAccessToken: string
    offset?: number
    limit?: number
    searchString?: number
    orderBy?: string
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/places?offset=${offset}&limit=${limit}${searchString ? `&searchString=${searchString}` : ''}${orderBy ? `&orderBy=${orderBy}` : ''}`,
      {
        method: 'GET',
        headers: { ['Authorization']: `Bearer ${apiAccessToken}` },
      }
    )
  },
  async getPlace({
    apiAccessToken,
    id,
  }: {
    apiAccessToken: string
    id: string
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/places/${id}`, {
      method: 'POST',
      headers: { ['Authorization']: `Bearer ${apiAccessToken}` },
    })
  },
  async getTransportationRoutes({
    apiAccessToken,
  }: {
    apiAccessToken: string
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/transportation-routes`, {
      method: 'POST',
      headers: { ['Authorization']: `Bearer ${apiAccessToken}` },
    })
  },
  async getTransportationRoute({
    apiAccessToken,
    id,
  }: {
    apiAccessToken: string
    id: string
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/transportation-routes/${id}`,
      {
        method: 'POST',
        headers: { ['Authorization']: `Bearer ${apiAccessToken}` },
      }
    )
  },
}

export interface RequestError<T extends any = any> {
  code: string
  message: string
  status: string
  namespace: string
  additional: T
}
