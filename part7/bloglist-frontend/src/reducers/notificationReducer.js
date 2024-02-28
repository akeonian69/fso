import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    resetNotification(state, action) {
      return ''
    },
  },
})

export const { setNotification, resetNotification } = notificationSlice.actions

export const showNotification = (msg) => {
  return async (dispatch) => {
    dispatch(setNotification(msg))
    setTimeout(() => dispatch(resetNotification()), 3000)
  }
}
export default notificationSlice.reducer
