import { createSlice } from '@reduxjs/toolkit'

const errorNotificationSlice = createSlice({
  name: 'errorNotification',
  initialState: '',
  reducers: {
    setErrorNotification(state, action) {
      return action.payload
    },
    resetErrorNotification(state, action) {
      return ''
    },
  },
})

export const { setErrorNotification, resetErrorNotification } =
  errorNotificationSlice.actions

export const showErrorNotification = (msg) => {
  return async (dispatch) => {
    dispatch(setErrorNotification(msg))
    setTimeout(() => dispatch(resetErrorNotification()), 4000)
  }
}

export default errorNotificationSlice.reducer
