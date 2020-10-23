import { createContext, useReducer, useContext } from 'react'

import { combineReducer } from './_helper'
import hairReducer from './hair'
import faceReducer from './face'
// import skinReducer from './skin'
import searchReducer from './search'
import metaReducer from './meta'
import characterReducer from './character'

import { isNil } from 'ramda'

const GlobalStore = createContext({})

const [combinedReducers, initialState] = combineReducer({
  hair: hairReducer,
  meta: metaReducer,
  character: characterReducer,
  face: faceReducer,
  search: searchReducer,
  // skin: skinReducer,
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
    keys.reduce(
      (currentState, key) =>
        isNil(currentState[key]) ? {} : currentState[key],
      state
    )
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
