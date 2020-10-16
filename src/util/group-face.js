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
    if (!allFaces[groupId]) allFaces[groupId] = { id: groupId, colors: {} }
    allFaces[groupId]['colors'][colorType] = face
    return allFaces
  }, {})
}

// Black
// Blue
// Red
// Green
// Hazel
// Sapphire
// Violet
// Amethyst
// White

export default groupFace
