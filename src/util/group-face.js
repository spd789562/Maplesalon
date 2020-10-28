const colorRemover = (str) => {
  const replaced = str.replace(
    /(.*)|黑色|青色|紅色|綠色|黃色|藍色|紫色|粉色|Black|Blue|Red|Green|Hazel|Sapphire|Violet|Amethyst|White/g,
    ''
  )
  return (replaced === str ? str : replaced).trim()
}

/**
 * formatFaceId
 * @description format face id to generic face id
 * @param {number|string} id - face id
 * @return {number}
 * @example
 *  formatFaceId(40100) // -> 4000
 *  formatFaceId(52301) // -> 5201
 */
export const formatFaceId = (id) =>
  +id.toString().replace(/([0-9][0-9])([0-9])([0-9][0-9])/, '$1$3')

/**
 * changeFaceColorId
 * @description change face id to other color
 * @param {number|string} id - face id
 * @param {number|string} changeColorId - color id
 * @return {number}
 * @example
 *  formatFaceId(40100, 2) // -> 40200
 *  formatFaceId(52301, 4) // -> 52401
 */
export const changeFaceColorId = (id, changeColorId) => {
  console.log(
    id,
    changeColorId,
    id
      .toString()
      .replace(/([0-9][0-9])([0-9])([0-9][0-9])/, `$1${changeColorId}$3`)
  )
  return +id
    .toString()
    .replace(/([0-9][0-9])([0-9])([0-9][0-9])/, `$1${changeColorId}$3`)
}

/**
 * getFaceColorId
 * @description ge face color id
 * @param {number|string} id - face id
 * @return {number}
 * @example
 *  formatFaceId(40100) // -> 1
 *  formatFaceId(52301) // -> 3
 */
export const getFaceColorId = (id) => +id.toString().split('').splice(2, 1)

/**
 * groupFace
 * @description Group face list
 * @param {Array<Face>} faces
 */
const groupFace = function groupFace(faces) {
  return faces.reduce((allFaces, face) => {
    const id = face.id + ''
    const splitedId = id.split('')
    const colorType = splitedId.splice(2, 1)
    const groupId = splitedId.join('')
    if (!allFaces[groupId])
      allFaces[groupId] = {
        id: groupId,
        colors: {},
        name: colorRemover(face.name),
      }
    allFaces[groupId]['colors'][colorType] = face
    return allFaces
  }, {})
}

export default groupFace
