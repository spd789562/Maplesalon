import { assoc, clone, map, evolve } from 'ramda'

/**
 * transparentifyCharacter
 * @description transparentify character items except face
 * @param {Character}
 * @return {Character}
 */
const transparentifyCharacter = function transparentifyCharacter(character) {
  const copyCharacter = evolve(
    {
      selectedItems: map(assoc('alpha', 0)),
    },
    clone(character)
  )
  copyCharacter.selectedItems.Face.alpha = 1
  return copyCharacter
}

export default transparentifyCharacter
