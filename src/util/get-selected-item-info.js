import { pickAll, path, pipe, defaultTo, evolve } from 'ramda'

const getSelectedItemInfo = function getSelectedItemInfo(character, field) {
  return pipe(
    path(['selectedItems', field]),
    defaultTo({}),
    pickAll(['id', 'region', 'version']),
    evolve({
      id: '',
      region: defaultTo('GMS'),
      version: defaultTo('217'),
    })
  )(character)
}

export default getSelectedItemInfo
