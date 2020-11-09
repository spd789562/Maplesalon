export const colorRemover = (str) =>
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
 * changeHairColorId
 * @description change face id to other color
 * @param {number|string} id - face id
 * @param {number|string} changeColorId - color id
 * @return {number}
 * @example
 *  formatHairId(30000, 2) // -> 30002
 *  formatHairId(34503, 4) // -> 34504
 */
export const changeHairColorId = (id, changeColorId) =>
  formatHairId(id) * 10 + +changeColorId

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
  return hair.reduce((allHair, hair) => {
    const groupId = formatHairId(hair.id)
    const colorType = getHairColorId(hair.id)
    if (!allHair[groupId]) {
      const name = name
      allHair[groupId] = {
        id: groupId,
        colors: {},
        name: colorRemover(hair.name),
      }
    }
    allHair[groupId]['colors'][colorType] = hair
    return allHair
  }, {})
}

export default groupHair
