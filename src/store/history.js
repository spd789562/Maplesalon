import { reducerCreator } from './_helper'
import { append, find, ifElse, propEq, takeLast } from 'ramda'

export const INITIAL_HISTORY = 'INITIAL_HISTORY'
export const APPEND_HISTORY = 'APPEND_HISTORY'

const initialState = []
const HISTORY_LIMIT = 10

const SaveToStorage = (state) => {
  localStorage.setItem('MAPLESALON_history', JSON.stringify(state))
  return state
}

const reducer = reducerCreator(initialState, {
  [INITIAL_HISTORY]: (state, payload) => payload,
  [APPEND_HISTORY]: (state, payload) =>
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
