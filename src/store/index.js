import { createContext, useReducer, useContext } from 'react'

import { combineReducer } from './_helper'
import hairReducer from './hair'
import metaReducer from './meta'

const GlobalStore = createContext({})

const [combinedReducers, initialState] = combineReducer({
  hair: hairReducer,
  meta: metaReducer,
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

export const useDispatch = () => useContext(GlobalStore).dispatch

export const useStore = (keyPath, initialValue = null) => {
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

  let result = findValue(path)
  if (
    initialValue !== null &&
    result.constructor === Object &&
    Object.keys(result).length === 0
  ) {
    result = initialValue
  }

  return [result, state.dispatch]
}
