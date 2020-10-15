/**
 * groupHair
 * @description Group hair list
 * @param {Array<Face>} hairs
 */
const groupHair = function groupHair(hair) {
  return hair.reduce((allHair, face) => {
    const groupId = Math.floor(face.id / 10)
    const colorType = face.id % 10
    if (allHair[groupId]) allHair[groupId] = { id: groupId }
    allHair[groupId]['colors'][colorType] = face
    return allHair
  }, {})
}

export default groupHair
