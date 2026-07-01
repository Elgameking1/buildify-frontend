import { createSlice } from '@reduxjs/toolkit'
import { workers } from '../../constants/workersData'

const workersSlice = createSlice({
  name: 'workers',
  initialState: {
    items: workers,
    selectedWorkerId: null,
    status: 'idle',
  },
  reducers: {
    setWorkers(state, action) {
      state.items = action.payload
    },
    setSelectedWorker(state, action) {
      state.selectedWorkerId = action.payload
    },
    updateWorkerAvailability(state, action) {
      const worker = state.items.find((item) => item.id === action.payload.id)

      if (worker) {
        worker.availability = action.payload.availability
      }
    },
  },
})

export const { setSelectedWorker, setWorkers, updateWorkerAvailability } =
  workersSlice.actions
export default workersSlice.reducer
