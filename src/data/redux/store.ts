//@ts-nocheck
import { configureStore } from '@reduxjs/toolkit'
import placesReducer from './slices/places'
import profilesReducer from './slices/profiles'

export const store = configureStore({
  reducer: {
    places: placesReducer,
    profiles: profilesReducer,
    // routes: routesReducer,
    // profiles: profilesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
