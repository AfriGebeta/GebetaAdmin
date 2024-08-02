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
  async getProfiles({
    apiAccessToken,
  }: {
    apiAccessToken: string
    offset?: number
    limit?: number
    searchString?: string
    orderBy?: string
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/profiles`, {
      method: 'GET',
      headers: { ['Authorization']: `Bearer ${apiAccessToken}` },
    })
  },
  async getProfile({
    apiAccessToken,
    id,
  }: {
    apiAccessToken: string
    id: string
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/profiles/${id}`, {
      method: 'GET',
      headers: { ['Authorization']: `Bearer ${apiAccessToken}` },
    })
  },
  async updateProfile({
    apiAccessToken,
    id,
    data,
  }: {
    apiAccessToken: string
    id: string
    data: {
      name?: string
      email?: string
      phoneNumber?: string
      collectionBoundary?: any
    }
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/profiles/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  },
  async createProfile({
    profileData,
  }: {
    apiAccessToken: string
    profileData: {
      firstName: string
      lastName: string
      email: string
      password: string
      phoneNumber: string
      collectionBoundary: { latitude: string; longitude: string }[]
    }
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        ...profileData,
        role: 'COLLECTOR',
      }),
    })
  },

  async createAdminProfile({
    profileData,
  }: {
    apiAccessToken: string
    profileData: {
      firstName: string
      lastName: string
      email: string
      password: string
      phoneNumber: string
    }
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        ...profileData,
        role: 'ADMIN',
      }),
    })
  },

  async deleteProfile({
    apiAccessToken,
    selectedId,
  }: {
    apiAccessToken: string
    selectedId: string
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/profiles/${selectedId}/delete`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
  },

  async activateProfile({
    apiAccessToken,
    id,
  }: {
    apiAccessToken: string
    id: string
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/profiles/${id}/activate`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${apiAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
  },
  async deactivateProfile({
    apiAccessToken,
    id,
  }: {
    apiAccessToken: string
    id: string
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/profiles/${id}/deactivate`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${apiAccessToken}`,
          'Content-Type': 'application/json',
        },
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
