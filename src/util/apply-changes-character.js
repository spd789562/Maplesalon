import {
  add,
  clone,
  evolve,
  isEmpty,
  isNil,
  mergeRight,
  pick,
  pipe,
} from 'ramda'
import getEarsType from '@utils/get-ears-type'

/**
 * applyChangesCharacter
 * @description transparentify character items except face
 * @param {Character}
 * @return {Character}
 */
const applyChangesCharacter = function applyChangesCharacter(
  character,
  characterChanges,
  regionData
) {
  if (isEmpty(character) || isNil(character)) return character
  const copyCharacter = clone(character)
  copyCharacter.isChange = false
  if (characterChanges.name) {
    copyCharacter.name = characterChanges.name
    copyCharacter.isChange = true
  }
  if (+characterChanges.skin.id !== +copyCharacter.skin) {
    copyCharacter.skin = characterChanges.skin.id
    copyCharacter.selectedItems.Body = mergeRight(
      copyCharacter.selectedItems.Body || {},
      evolve({ id: Number }, characterChanges.skin)
    )
    copyCharacter.selectedItems.Head = mergeRight(
      copyCharacter.selectedItems.Head || {},
      evolve({ id: pipe(Number, add(10000)) }, characterChanges.skin)
    )
    copyCharacter.isChange = true
  }
  const originEarsType = getEarsType(copyCharacter)
  if (characterChanges.earsType !== originEarsType) {
    copyCharacter.mercEars = characterChanges.earsType === '1'
    copyCharacter.illiumEars = characterChanges.earsType === '2'
    copyCharacter.highFloraEars = characterChanges.earsType === '3'
    copyCharacter.isChange = true
  }
  if (
    !copyCharacter.selectedItems.Hair ||
    (characterChanges.hairId &&
      characterChanges.hairId !== copyCharacter.selectedItems.Hair.id)
  ) {
    copyCharacter.selectedItems.Hair = mergeRight(
      copyCharacter.selectedItems.Hair || {},
      {
        id: characterChanges.hairId,
        ...pick(['region', 'version'], regionData),
      }
    )
    copyCharacter.isChange = true
  }
  if (
    !copyCharacter.selectedItems.Face ||
    (characterChanges.faceId &&
      characterChanges.faceId !== copyCharacter.selectedItems.Face.id)
  ) {
    copyCharacter.selectedItems.Face = mergeRight(
      copyCharacter.selectedItems.Face || {},
      {
        id: characterChanges.faceId,
        ...pick(['region', 'version'], regionData),
      }
    )
    copyCharacter.isChange = true
  }
  // has mix dye hair
  if (
    (characterChanges.mixHairColorId &&
      characterChanges.mixHairColorId !== characterChanges.hairColorId) ||
    (characterChanges.mixFaceColorId &&
      characterChanges.mixFaceColorId !== characterChanges.faceColorId)
  ) {
    copyCharacter.mixDye = {
      hairColorId: characterChanges.mixHairColorId,
      hairOpacity: characterChanges.mixHairOpacity,
      faceColorId: characterChanges.mixFaceColorId,
      faceOpacity: characterChanges.mixFaceOpacity,
    }
    const hairColorIsDifferent =
      characterChanges.hairColorId !== copyCharacter.mixDye.hairColorId
    const faceColorIsDifferent =
      characterChanges.faceColorId !== copyCharacter.mixDye.faceColorId
    // has different mix color
    if (
      !character.mixDye ||
      (hairColorIsDifferent &&
        character.mixDye.hairOpacity !== characterChanges.mixHairOpacity) ||
      (faceColorIsDifferent &&
        character.mixDye.mixFaceOpacity !== characterChanges.mixFaceOpacity)
    ) {
      copyCharacter.isChange = true
    }
  } else {
    copyCharacter.mixDye = undefined
    // cancle mix color
    if (character.mixDye) {
      copyCharacter.isChange = true
    }
  }
  return copyCharacter
}

export default applyChangesCharacter
