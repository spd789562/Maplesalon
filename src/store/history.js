import { reducerCreator } from './_helper'
import { append, find, ifElse, propEq, takeLast } from 'ramda'

export const HISTORY_INITIAL = 'HISTORY_INITIAL'
export const HISTORY_APPEND = 'HISTORY_APPEND'

const initialState = []
const HISTORY_LIMIT = 10

const SaveToStorage = (state) => {
  localStorage.setItem('MAPLESALON_history', JSON.stringify(state))
  return state
}

const reducer = reducerCreator(initialState, {
  [HISTORY_INITIAL]: (state, payload) => payload,
  [HISTORY_APPEND]: (state, payload) =>
    pipe(
      ifElse(find(propEq('id', payload.id)), identity, append(payload)),
      takeLast(HISTORY_LIMIT),
      SaveToStorage
    )(state),
})

export default {
  initialState,
  reducer,
}
