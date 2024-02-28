import { createContext, useReducer, useContext } from 'react'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'RESET':
      return null
    default:
      return state
  }
}

const UserContext = createContext()

export const useUserValue = () => {
  const array = useContext(UserContext)
  return array[0]
}

export const useUserDispatch = () => {
  const array = useContext(UserContext)
  return array[1]
}

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)
  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext
