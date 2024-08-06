import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Boundary, Profile } from '@/model'
import { arrayToHashMap } from '@/utils'

const NAME = 'profiles'

interface ProfilesState {
  profiles: { [profileId: string]: Profile }
}

const initialState: ProfilesState = {
  profiles: {},
}

export const profilesSlice = createSlice({
  name: NAME,
  initialState,
  reducers: {
    // addProfiles: (state, action: PayloadAction<Profile[]>) => {
    //   const profilesHash = arrayToHashMap(action.payload, 'id');
    //   state.profiles = {
    //     ...state.profiles,
    //     ...profilesHash,
    //   };
    // },
    addProfiles: (state, action: PayloadAction<Array<Profile>>) => {
      const placesHash = arrayToHashMap(action.payload, 'id')

      state.profiles = {
        ...state.profiles,
        ...placesHash,
      }
    },
    addProfile: (state, action: PayloadAction<Profile>) => {
      state.profiles = {
        ...state.profiles,
        [action.payload.id]: action.payload,
      }
    },
    updateProfileActivation: (
      state,
      action: PayloadAction<{ id: string; isActive: boolean }>
    ) => {
      const { id, isActive } = action.payload
      const profile = state.profiles[id]

      if (profile) {
        profile.active = isActive
      }
    },
    updateProfile: (
      state,
      action: PayloadAction<{
        id: string
        data: {
          firstName: string
          lastName: string
          email: string
          collectionBoundary: { latitude: string; longitude: string }[]
        }
      }>
    ) => {
      const {
        id,
        data: { firstName, lastName, email, collectionBoundary },
      } = action.payload
      console.log(
        'updateProfile',
        id,
        firstName,
        lastName,
        email,
        collectionBoundary
      )
      const profile = state.profiles[id]
      if (profile) {
        profile.firstName = firstName
        profile.lastName = lastName
        profile.email = email
        profile.collectionBoundary = collectionBoundary
      }
      // state.profiles = {
      //   ...state.profiles,
      //   [action.payload.id]: action.payload,
      // }
    },
    removeProfile: (state, action: PayloadAction<string>) => {
      const { [action.payload]: _, ...remainingProfiles } = state.profiles
      state.profiles = remainingProfiles
    },
    removeProfiles: (state, action: PayloadAction<string[]>) => {
      const remainingProfiles = { ...state.profiles }
      action.payload.forEach((profileId) => {
        delete remainingProfiles[profileId]
      })
      state.profiles = remainingProfiles
    },
    clearProfiles: (state) => {
      state.profiles = {}
    },
  },
})

export const {
  addProfiles,
  addProfile,
  updateProfile,
  removeProfile,
  removeProfiles,
  clearProfiles,
  updateProfileActivation,
} = profilesSlice.actions

export const selectProfiles = (state: RootState) => state.profiles.profiles

export default profilesSlice.reducer
