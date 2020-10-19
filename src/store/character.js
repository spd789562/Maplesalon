import { reducerCreator } from './_helper'

import { find, findIndex, mergeRight, propEq, update } from 'ramda'

export const CHARACTER_CHANGE = 'CHARACTER_CHANGE'
export const CHARACTER_APPEND = 'CHARACTER_APPEND'
export const CHARACTER_UPDATE = 'CHARACTER_UPDATE'
export const CHARACTER_DUPLICATE = 'CHARACTER_DUPLICATE'
export const CHARACTER_DELETE = 'CHARACTER_DELETE'

const initialState = {
  characters: [],
  currentId: 0,
}

const reducer = reducerCreator(initialState, {
  [CHARACTER_CHANGE]: (state, payload) =>
    mergeRight(state, { currentId: payload }),
  [CHARACTER_APPEND]: (state, payload) =>
    evolve(
      { characters: concat(Array.isArray(payload) ? payload : [payload]) },
      state
    ),
  [CHARACTER_UPDATE]: (state, payload) =>
    evolve(
      {
        characters: update(
          findIndex(propEq('id', payload.id), state.characters),
          payload
        ),
      },
      state
    ),
  [CHARACTER_DUPLICATE]: (state, payload) =>
    evolve(
      {
        characters: insert(
          findIndex(propEq('id', payload), state.characters),
          find(propEq('id', payload), state.characters)
        ),
      },
      state
    ),
  [CHARACTER_DELETE]: (state, payload) =>
    evolve(
      {
        characters: remove(
          findIndex(propEq('id', payload), state.characters),
          1
        ),
      },
      state
    ),
})

export default {
  initialState,
  reducer,
}
