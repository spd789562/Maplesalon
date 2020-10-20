import { reducerCreator } from './_helper'

import { find, findIndex, mergeRight, propEq, update } from 'ramda'

export const CHARACTER_CHANGE = 'CHARACTER_CHANGE'
export const CHARACTER_APPEND = 'CHARACTER_APPEND'
export const CHARACTER_UPDATE = 'CHARACTER_UPDATE'
export const CHARACTER_DUPLICATE = 'CHARACTER_DUPLICATE'
export const CHARACTER_DELETE = 'CHARACTER_DELETE'

const isClient = typeof window !== 'undefined'
const initialCharacters = (isClient &&
  localStorage.getItem('MAPLESALON_characters')) || [
  {
    id: 100000000,
    type: 'character',
    action: 'stand1',
    emotion: 'default',
    skin: '2000',
    frame: 0,
    mercEars: false,
    illiumEars: false,
    highFloraEars: false,
    selectedItems: {
      Body: {
        id: 2000,
        region: 'TWMS',
        version: '228',
      },
      Head: {
        id: 12000,
        region: 'TWMS',
        version: '228',
      },
      Face: {
        requiredGender: 1,
        name: '새초롬 얼굴',
        id: 28087,
        region: 'KMS',
        version: '338',
      },
      Hair: {
        requiredGender: 2,
        name: '紅色齊眉自然造型',
        id: 30301,
        region: 'TWMS',
        version: '228',
      },
    },
    visible: true,
    fhSnap: true,
    flipX: false,
    name: '中文',
    animating: false,
  },
]

const initialState = {
  characters: (isClient && localStorage.getItem('MAPLESALON_characters')) || [],
  currentId: initialCharacters[0].id,
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
