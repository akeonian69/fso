import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import errorNotificationReducer from './reducers/errorNotificationReducer'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  reducer: {
    user: userReducer,
    blogs: blogReducer,
    notification: notificationReducer,
    errorNotification: errorNotificationReducer,
  },
})

export default store
