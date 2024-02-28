import { createContext, useReducer, useContext } from 'react'

const errorNotificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MSG':
      return action.payload
    case 'RESET_MSG':
      return ''
    default:
      return state
  }
}

const ErrorNotificationContext = createContext()

export const useErrorNotificationValue = () => {
  const array = useContext(ErrorNotificationContext)
  return array[0]
}

export const useErrorNotificationDispatch = () => {
  const array = useContext(ErrorNotificationContext)
  return array[1]
}

export const ErrorNotificationContextProvider = (props) => {
  const [errorNotification, errorNotificationDispatch] = useReducer(
    errorNotificationReducer,
    ''
  )
  return (
    <ErrorNotificationContext.Provider
      value={[errorNotification, errorNotificationDispatch]}
    >
      {props.children}
    </ErrorNotificationContext.Provider>
  )
}

export default ErrorNotificationContext
