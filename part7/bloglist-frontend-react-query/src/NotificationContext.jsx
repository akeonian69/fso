import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MSG':
      return action.payload
    case 'RESET_MSG':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const useNotificationValue = () => {
  const array = useContext(NotificationContext)
  return array[0]
}

export const useNotificationDispatch = () => {
  const array = useContext(NotificationContext)
  return array[1]
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  )
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
