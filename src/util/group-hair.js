const colorRemover = (str) =>
  str
    .replace(
      /Black|Red|Orange|Yellow|Green|Blue|Purple|Brown|黑色|紅色|橘色|黃色|綠色|藍色|紫色|褐色|(|)/g,
      ''
    )
    .trim()

/**
 * formatHairId
 * @description format hair id to generic hair id
 * @param {number|string} id - hair id
 * @return {number}
 * @example
 *  formatHairId(30000) // -> 3000
 *  formatHairId(34503) // -> 3450
 */
export const formatHairId = (id) => Math.floor(+id / 10)

/**
 * getHairColorId
 * @description ge hair color id
 * @param {number|string} id - hair id
 * @return {number}
 * @example
 *  formatHairId(30000) // -> 0
 *  formatHairId(34503) // -> 3
 */
export const getHairColorId = (id) => +id % 10

/**
 * groupHair
 * @description Group hair list
 * @param {Array<Face>} hairs
 */
const groupHair = function groupHair(hair) {
  return hair.reduce((allHair, face) => {
    const groupId = formatHairId(face.id)
    const colorType = getHairColorId(face.id)
    if (!allHair[groupId]) {
      const name = name
      allHair[groupId] = {
        id: groupId,
        colors: {},
        name: colorRemover(face.name),
      }
    }
    allHair[groupId]['colors'][colorType] = face
    return allHair
  }, {})
}

export default groupHair
