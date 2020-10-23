import { reducerCreator } from './_helper'

export const SEARCH_UPDATE = 'SEARCH_UPDATE'

const initialState = {
  hair: {
    name: '',
    gender: '',
  },
  face: {
    name: '',
    gender: '',
  },
}

const reducer = reducerCreator(initialState, {
  [SEARCH_UPDATE]: (state, { type, field, value }) => ({
    ...state,
    [type]: {
      ...state[type],
      [field]: value,
    },
  }),
})

export default {
  initialState,
  reducer,
}
