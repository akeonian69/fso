import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notificationMsg(state, action) {
        console.log(state, action)
        return action.payload
    },
    resetMsg(state, action) {
        console.log(state, action)
        return ''
    }
  }
})

export const { notificationMsg, resetMsg } = notificationSlice.actions

export const setNotification = (message, ms) => {
  return dispatch => {
    dispatch(notificationMsg(message))
    setTimeout(() => {
      dispatch(resetMsg())
    }, ms)
  }
}

export default notificationSlice.reducer