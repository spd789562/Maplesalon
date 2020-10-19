import { reducerCreator } from './_helper'

export const INITIAL_WZ = 'INITIAL_WZ'
export const UPDATE_CHARACTER = 'UPDATE_CHARACTER'
export const CHANGE_REGION = 'CHANGE_REGION'

const isClient = typeof window !== 'undefined'

const initialState = {
  region: {
    region: (isClient && localStorage.getItem('region')) || '',
    version: (isClient && localStorage.getItem('version')) || '',
  },
  character: {
    skinId: '2000',
    hairId: '',
    hairColorId: '0',
    faceId: '',
    faceColorId: '0',
    mixHairColorId: '0',
    mixHairOpacity: 0.5,
    mixFaceColorId: '0',
    mixFaceOpacity: 0.5,
    items: {},
  },
  wz: {},
}
const reducer = reducerCreator(initialState, {
  [CHANGE_REGION]: (state, payload) => {
    let { region, version } =
      typeof payload === 'string' ? state.wz[payload] : payload
    localStorage.setItem('region', region)
    localStorage.setItem('version', version)
    return { ...state, region: { region, version } }
  },
  [UPDATE_CHARACTER]: (state, payload) => {
    return { ...state, character: { ...state.character, ...payload } }
  },
  [INITIAL_WZ]: (state, payload) => ({ ...state, wz: payload }),
})

export default {
  initialState,
  reducer,
}
