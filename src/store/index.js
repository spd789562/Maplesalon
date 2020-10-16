import { createContext, useReducer, useContext } from 'react'

import { combineReducer } from './_helper'
import hairReducer from './hair'

const GlobalStore = createContext({})

const [combinedReducers, initialState] = combineReducer({
  hair: hairReducer,
  // face,
  // skin,
  // character
})

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(combinedReducers, initialState)
  return (
    <GlobalStore.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </GlobalStore.Provider>
  )
}

export const useStore = (keyPath) => {
  const state = useContext(GlobalStore)
  let path = []
  const findValue = (keys) =>
    keys.reduce((currentState, key) => currentState[key] || {}, state)
  if (keyPath.indexOf('.') !== 1) {
    path = keyPath.split('.')
  } else if (Array.isArray(keyPath)) {
    path = keyPath
  } else {
    path = [keyPath]
  }

  return [findValue(path), state.dispatch]
}
