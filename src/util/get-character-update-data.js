import { getHairColorId } from '@utils/group-hair'
import { getFaceColorId } from '@utils/group-face'
import getSkinRegion from '@utils/get-skin-region'
import getEarsType from '@utils/get-ears-type'
import getSelectedItemInfo from '@utils/get-selected-item-info'
import { pickAll } from 'ramda'

const getCharacterUpdateData = function getCharacterUpdateData(character) {
  const name = character.name
  const characterHairId = character.selectedItems?.Hair?.id || ''
  const characterFaceId = character.selectedItems?.Face?.id || ''
  const characterHairColorId = getHairColorId(characterHairId) + ''
  const characterFaceColorId = getFaceColorId(characterFaceId) + ''
  const skin = getSkinRegion(character.skin)
  const earsType = getEarsType(character)
  const mixHairColorId = character.mixDye?.hairColorId || characterHairColorId
  const mixHairOpacity = character.mixDye?.hairOpacity || 0.5
  const mixFaceColorId = character.mixDye?.faceColorId || characterFaceColorId
  const mixFaceOpacity = character.mixDye?.faceOpacity || 0.5
  const overall = getSelectedItemInfo(character, 'Overall')
  const hat = getSelectedItemInfo(character, 'Hat')

  return {
    name,
    hair: {
      ...pickAll(
        ['id', 'region', 'version'],
        character.selectedItems?.Hair || {}
      ),
      colorId: characterHairColorId,
    },
    face: {
      ...pickAll(
        ['id', 'region', 'version'],
        character.selectedItems?.Face || {}
      ),
      colorId: characterFaceColorId,
    },
    skin,
    earsType,
    mixHairColorId,
    mixHairOpacity,
    mixFaceColorId,
    mixFaceOpacity,
    overall,
    hat,
  }
}

export default getCharacterUpdateData
