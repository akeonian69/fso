import { createContext, useReducer, useContext } from "react"

const notificationReducer = (state, action) => {
  switch(action.type) {
    case "SET_MESSAGE":
      return action.payload
    case "RESET_MESSAGE":
      return ""
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [message, messageDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[message, messageDispatch]}>
        {props.children}
    </NotificationContext.Provider>
  )
}

export const useMessageValue = () => {
  const array = useContext(NotificationContext)
  return array[0]
}

export const useMessageDispatch = () => {
  const array = useContext(NotificationContext)
  return array[1]
}

export default NotificationContext