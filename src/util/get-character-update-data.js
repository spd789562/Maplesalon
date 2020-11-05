import { getHairColorId } from '@utils/group-hair'
import { getFaceColorId } from '@utils/group-face'
import getSkinRegion from '@utils/get-skin-region'
import getEarsType from '@utils/get-ears-type'

const getCharacterUpdateData = function getCharacterUpdateData(character) {
  const name = character.name
  const characterHairId = character.selectedItems?.Hair.id || ''
  const characterFaceId = character.selectedItems?.Face.id || ''
  const characterHairColorId = getHairColorId(characterHairId) + ''
  const characterFaceColorId = getFaceColorId(characterFaceId) + ''
  const skin = getSkinRegion(character.skin)
  const earsType = getEarsType(character)
  const mixHairColorId = character.mixDye?.hairColorId || characterHairColorId
  const mixHairOpacity = character.mixDye?.hairOpacity || 0.5
  const mixFaceColorId = character.mixDye?.faceColorId || characterFaceColorId
  const mixFaceOpacity = character.mixDye?.faceOpacity || 0.5

  return {
    name,
    hairId: characterHairId,
    hairColorId: characterHairColorId,
    faceId: characterFaceId,
    faceColorId: characterFaceColorId,
    skin,
    earsType,
    mixHairColorId,
    mixHairOpacity,
    mixFaceColorId,
    mixFaceOpacity,
  }
}

export default getCharacterUpdateData
