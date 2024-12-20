import { Place } from '@/model'

// @ts-ignore
export default {
  async signIn(data: { username: string; password: string }) {
    return await fetch(
      `${import.meta.env['VITE_API_BASE_URL']}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
  },
  async logout({ apiAccessToken }: { apiAccessToken: string }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { ['Authorization']: `Bearer ${apiAccessToken}` },
    })
  },
  async getPlaces({
    apiAccessToken,
    page,
    limit = 10,
  }: {
    apiAccessToken: string
    limit?: number
    page?: number
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/getAllPlaces?apiKey=${apiAccessToken}&limit=${limit}&page=${page}`,
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
      method: 'GET',
      headers: { ['Authorization']: `Bearer ${apiAccessToken}` },
    })
  },
  async createPlace({
    place,
  }: {
    place: {
      name: string
      city: string
      country: string
      lat: string
      lon: string
      type: string
      apiKey: string
    }
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/route/addPlace`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(place),
    })
  },
  async updatePlace({
    apiAccessToken,
    id,
    place,
  }: {
    apiAccessToken: string
    id: string
    place: Partial<Place>
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/places/${id}`, {
      method: 'PATCH',
      headers: {
        ['Authorization']: `Bearer ${apiAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(place),
    })
  },

  async deletePlace({
    apiAccessToken,
    id,
  }: {
    apiAccessToken: string
    id: string
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/route/delete-place&id=${id}`,
      {
        method: 'DELETE',
        headers: {
          ['Authorization']: `Bearer ${apiAccessToken}`,
        },
      }
    )
  },
  async getBundles({
    apiAccessToken,
    page,
    limit,
  }: {
    apiAccessToken: string
    page: number
    limit: number
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/credit-bundle/getAll?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: { ['Authorization']: `Bearer ${apiAccessToken}` },
      }
    )
  },
  async createBundle({
    apiAccessToken,
    bundleData,
  }: {
    apiAccessToken: string
    bundleData: {
      name: string
      price: number
      rate: number
      expirationDate: string
      callCaps: number[]
      includedCallTypes: string[]
      expiredIn: number
    }
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/api/credit-bundle`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${apiAccessToken}`,
      },
      body: JSON.stringify(bundleData),
    })
  },
  async buyBundle({
    apiAccessToken,
    data,
  }: {
    apiAccessToken: string
    data: {
      user_id: string
      payment_method: string
      payment_for: string
      credit_bundle_id: string
    }
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/payment/admin/credit`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${apiAccessToken}`,
        },
        body: JSON.stringify(data),
      }
    )
  },
  async updateBundle({
    apiAccessToken,
    id,
    data,
  }: {
    apiAccessToken: string
    id: string
    data: {
      includedCallTypes: string[]
      name: string
      rate: number
      price: number
      expiration: string
      callCaps: number[]
      expiredIn: number
    }
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/api/credit-bundle`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${apiAccessToken}`,
      },
      body: JSON.stringify({ ...data, id }),
    })
  },
  async deleteBundle({
    apiAccessToken,
    id,
  }: {
    apiAccessToken: string
    id: string
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/credit-bundle?id=${id}`,
      {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${apiAccessToken}`,
        },
      }
    )
  },
  async getPreSignedUrl({ apiAccessToken }: { apiAccessToken: string }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/places/images/pre-signed-url`,
      {
        method: 'GET',
        headers: {
          ['Authorization']: `Bearer ${apiAccessToken}`,
        },
      }
    )
  },

  async uploadImage({ file, uploadUrl }: { file: File; uploadUrl: string }) {
    return fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type ?? 'application/octet-stream',
      },
      body: file,
    })
  },
  async getUsers({
    apiAccessToken,
    page = 1,
    limit,
  }: {
    apiAccessToken: string
    page: number
    limit: number
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/user/getAll?apiKey=${apiAccessToken}&page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: { ['Authorization']: `Bearer ${apiAccessToken}` },
      }
    )
  },
  async updateUser({
    apiAccessToken,
    data,
  }: {
    apiAccessToken: string
    id: string
    data: {
      name?: string
      email?: string
    }
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  },
  async createUser({
    apiAccessToken,
    profileData,
  }: {
    apiAccessToken: string
    profileData: {
      username: string
      password: string
      companyname: string
      is_organization: boolean
      firstname: string
      lastname: string
      email: string
      phone: string
    }
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...profileData, otp: '1234' }),
    })
  },
  async updatePurchasedDate({
    apiAccessToken,
    id,
  }: {
    apiAccessToken: string
    id: string
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/updatedate`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: id }),
    })
  },
  async resetPassword({
    apiAccessToken,
    id,
  }: {
    apiAccessToken: string
    id: string
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset/pass/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiAccessToken}`,
        },
      }
    )
  },
  async deleteProfile({
    apiAccessToken,
    selectedId,
  }: {
    apiAccessToken: string
    selectedId: string
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/profiles/${selectedId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
  },
  async setToken({
    apiAccessToken,
    id,
  }: {
    apiAccessToken: string
    id: string
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/user/update-user-token`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${apiAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: id }),
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
  async getUsage({
    apiAccessToken,
    id,
    startDate,
    endDate,
  }: {
    apiAccessToken: string
    id: string
    startDate: string
    endDate: string
  }) {
    return fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/usage/graph/all?startDate=${startDate}&endDate=${endDate}&userId=${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiAccessToken}`,
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
  async getBoundary({ apiAccessToken }: { apiAccessToken: string }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/boundary`, {
      method: 'GET',
      headers: {
        ['Authorization']: `Bearer ${apiAccessToken}`,
      },
    })
  },
  async getSpecificBoundary({
    id,
    apiAccessToken,
  }: {
    id?: string
    apiAccessToken: string
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/boundary/${id}`, {
      method: 'GET',
      headers: {
        ['Authorization']: `Bearer ${apiAccessToken}`,
      },
    })
  },
  async createBoundary({
    apiAccessToken,
    name,
    bounds,
  }: {
    apiAccessToken: string
    name: string
    bounds: { latitude: string; longitude: string }[]
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/boundary`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${apiAccessToken}`,
      },
      body: JSON.stringify({ name: name, bounds: bounds }),
    })
  },
  async updateBoundary({
    apiAccessToken,
    id,
    boundaryData,
  }: {
    apiAccessToken: string
    id: string | undefined
    boundaryData: {
      name: string
      bounds: { latitude: string; longitude: string }[]
    }
  }) {
    console.log('upating')
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/boundary/${id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${apiAccessToken}`,
      },
      body: JSON.stringify({
        name: boundaryData.name,
        bounds: boundaryData.bounds,
      }),
    })
  },
  async deleteBoundary({
    apiAccessToken,
    id,
  }: {
    apiAccessToken: string
    id: string
  }) {
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/boundary/${id}`, {
      method: 'DELETE',
      headers: {
        ['Authorization']: `Bearer ${apiAccessToken}`,
      },
    })
  },
}

export interface RequestError<T extends any = any> {
  code: string
  message: string
  status: string
  namespace: string
  additional: T
}
