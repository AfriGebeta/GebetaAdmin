import { Boundary } from '@/model'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { arrayToHashMap } from '@/utils'
import type { RootState } from '../store'

const NAME = 'boundary'

interface BoundaryState {
  boundary: { [boundaryId: string]: Boundary }
}

const initialState: BoundaryState = {
  boundary: {},
}

export const boundarySlice = createSlice({
  name: NAME,
  initialState,
  reducers: {
    addBoundary: (state, action: PayloadAction<Array<Boundary>>) => {
      const boundaryHash = arrayToHashMap(action.payload, 'id')
      state.boundary = {
        ...state.boundary,
        ...boundaryHash,
      }
    },
  },
})

export const selectBoundary = (state: RootState) => state.boundary.boundary

export const { addBoundary } = boundarySlice.actions
export default boundarySlice.reducer
