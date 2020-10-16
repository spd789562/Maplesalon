const colorRemover = (str) =>
  str
    .replace(
      /Black|Red|Orange|Yellow|Green|Blue|Purple|Brown|黑色|紅色|橘色|黃色|綠色|藍色|紫色|褐色|(|)/g,
      ''
    )
    .trim()

/**
 * groupHair
 * @description Group hair list
 * @param {Array<Face>} hairs
 */
const groupHair = function groupHair(hair) {
  return hair.reduce((allHair, face) => {
    const groupId = Math.floor(face.id / 10)
    const colorType = face.id % 10
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
