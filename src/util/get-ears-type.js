const getEarsType = function getEarsType(character) {
  return character.highFloraEars
    ? '3'
    : character.illiumEars
    ? '2'
    : character.mercEars
    ? '1'
    : '0'
}

export default getEarsType
