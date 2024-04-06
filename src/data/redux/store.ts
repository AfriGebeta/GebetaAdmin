//@ts-nocheck
import { configureStore } from '@reduxjs/toolkit'
import placesReducer from './slices/places'

export const store = configureStore({
  reducer: {
    places: placesReducer,
    // routes: routesReducer,
    // profiles: profilesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
