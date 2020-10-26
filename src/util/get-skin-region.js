import Skins from '@mapping/skins'
import { propEq } from 'ramda'

const getSkinRegion = function getSkinRegion(id) {
  return Skins.find(propEq('id', +id))
}

export default getSkinRegion
