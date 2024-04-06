import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { Place } from '@/model'
import { arrayToHashMap } from '@/utils'

const NAME = 'places'

interface PlacesState {
  places: { [placeId: string]: Place }
}

const initialState: PlacesState = {
  places: {},
}

export const placesSlice = createSlice({
  name: NAME,
  initialState,
  reducers: {
    addPlaces: (state, action: PayloadAction<Array<Place>>) => {
      const placesHash = arrayToHashMap(action.payload, 'id')

      state.places = {
        ...state.places,
        ...placesHash,
      }
    },
    addPlace: (state, action: PayloadAction<Place>) => {
      state.places = {
        ...state.places,
        [action.payload.id]: action.payload,
      }
    },
    removePlace: (state, action: PayloadAction<string>) => {
      state.places = {
        ...state.places,
        [action.payload]: undefined,
      }
    },
    removePlaces: (state, action: PayloadAction<Array<string>>) => {
      const update: { [id: string]: undefined } = {}

      for (const placeId of action.payload) {
        update[action.payload] = undefined
      }

      state.places = {
        ...state.places,
        ...update,
      }
    },
  },
})

export const { addPlaces, addPlace, removePlaces, removePlace } =
  placesSlice.actions

export const selectPlaces = (state: RootState) => state.places.places

export const selectPlace = (id: string) => (state: RootState) =>
  state.places.places[id]

export default placesSlice.reducer
