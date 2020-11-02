import { reducerCreator } from './_helper'

import {
  find,
  findIndex,
  mergeRight,
  propEq,
  update,
  evolve,
  concat,
  insert,
  remove,
  move,
  prop,
  max,
  assoc,
  add,
  __,
  ifElse,
  pipe,
  append,
  curry,
  equals,
} from 'ramda'

export const CHARACTER_CHANGE = 'CHARACTER_CHANGE'
export const CHARACTER_REORDER = 'CHARACTER_REORDER'
export const CHARACTER_APPEND = 'CHARACTER_APPEND'
export const CHARACTER_UPDATE = 'CHARACTER_UPDATE'
export const CHARACTER_DUPLICATE = 'CHARACTER_DUPLICATE'
export const CHARACTER_DELETE = 'CHARACTER_DELETE'

const initialState = {
  characters: [],
  current: {},
  lastId: 1000000,
}

const findCharacterById = (id, characters) => find(propEq('id', id), characters)
const findCharacterIndexById = curry((id, characters) =>
  findIndex(propEq('id', id), characters)
)

const reducer = reducerCreator(initialState, {
  [CHARACTER_CHANGE]: (state, payload) =>
    mergeRight(state, {
      current: findCharacterById(payload, state.characters),
    }),
  [CHARACTER_REORDER]: (state, payload) =>
    evolve(
      { characters: move(payload.source.index, payload.destination.index) },
      state
    ),
  [CHARACTER_APPEND]: (state, payload) =>
    evolve(
      {
        characters: concat(
          __,
          (Array.isArray(payload) ? payload : [payload]).map((c, index) =>
            assoc('id', state.lastId + 1 + index, c)
          )
        ),
        lastId: add((Array.isArray(payload) ? payload : [payload]).length),
      },
      state
    ),
  [CHARACTER_UPDATE]: (state, payload) =>
    evolve(
      {
        characters: pipe(
          findCharacterIndexById(payload.id),
          ifElse(
            // If character has been delete, append this
            equals(-1),
            () => append(payload, state.characters),
            update(__, payload, state.characters)
          )
        ),
      },
      state
    ),
  [CHARACTER_DUPLICATE]: (state, payload) =>
    evolve(
      {
        characters: insert(
          findIndex(propEq('id', payload), state.characters),
          mergeRight(findCharacterById(payload, state.characters), {
            id: state.lastId + 1,
          })
        ),
        lastId: add(1),
      },
      state
    ),
  [CHARACTER_DELETE]: (state, payload) =>
    evolve(
      {
        characters: remove(
          findCharacterIndexById(payload, state.characters),
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
