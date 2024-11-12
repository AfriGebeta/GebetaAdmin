import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Profile } from '@/model'

const NAME = 'profiles'

interface ProfilesState {
  profiles: { count: number; users: Profile[] }
}

const initialState: ProfilesState = {
  profiles: { count: 0, users: [] },
}

export const profilesSlice = createSlice({
  name: NAME,
  initialState,
  reducers: {
    addProfiles: (state, action: PayloadAction<Array<Profile>>) => {
      const profiles = action.payload

      state.profiles = {
        ...state.profiles,
        ...profiles,
      }
    },
    addProfile: (state, action: PayloadAction<Profile>) => {
      state.profiles = {
        ...state.profiles,
        [action.payload.id]: action.payload,
      }
    },
    updateProfile: (
      state,
      action: PayloadAction<{
        id: string
        data: {
          name: string
          phone: string
          purchased_date: string
          email: string
        }
      }>
    ) => {
      const {
        id,
        data: { name, phone, email, purchased_date },
      } = action.payload
      console.log('updateProfile', id, name, email, phone, purchased_date)
      const profile = state.profiles.users.find((user) => user.id == id)
      if (profile) {
        profile.name = name
        profile.phone = phone
        profile.email = email
        profile.purchased_date = purchased_date
      }
      state.profiles = {
        ...state.profiles,
        [action.payload.id]: action.payload,
      }
    },
  },
})

export const { addProfiles, addProfile, updateProfile } = profilesSlice.actions

export const selectProfiles = (state: RootState) => state.profiles.profiles

export default profilesSlice.reducer
