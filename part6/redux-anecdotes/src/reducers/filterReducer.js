import { createSlice } from "@reduxjs/toolkit"

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filterAnecdote(state, action) {
      console.log(action)
      return action.payload
    }
  }
})

export const { filterAnecdote } = filterSlice.actions
export default filterSlice.reducer