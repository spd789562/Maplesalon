import { filter, map, mergeRight, pipe, propEq, flatten } from 'ramda'

const LoadCharacter = (file) =>
  new Promise((resolve) => {
    const fr = new FileReader()
    fr.onload = function loadCharacterJson(event) {
      try {
        const data = JSON.parse(event.target.result)
        resolve(data)
      } catch {
        resolve(false)
      }
    }
    fr.readAsText(file)
  })

const validateCharacter = (character) => {
  if (!character) return false
  if (!character.type || character.type !== 'character') return false
  if (!character.selectedItems?.Body?.id) return false
  if (!character.selectedItems?.Head?.id) return false
  return true
}

const mergeDefaultCharacter = (character) => {
  const overridableData = mergeRight(
    {
      skin: 2000,
      mercEars: false,
      illiumEars: false,
      highFloraEars: false,
    },
    character
  )
  return mergeRight(overridableData, {
    action: 'stand1',
    emotion: 'default',
    frame: 0,
    animating: false,
  })
}

const importCharactersFromFile = function importCharactersFromFile(files) {
  const loadPromises = Array.from(files)
    .filter(propEq('type', 'application/json'))
    .map(LoadCharacter)
  return Promise.all(loadPromises).then(
    pipe(flatten, filter(validateCharacter), map(mergeDefaultCharacter))
  )
}

export default importCharactersFromFile
