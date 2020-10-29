import { useMemo } from 'react'

/* store */
import { useStore } from '@store'

/* utils */
import applyChangesCharacter from '@utils/apply-changes-character'

const useChangedCharacter = () => {
  const [currentCharacter, dispatch] = useStore('character.current', {})
  const [characterChanges] = useStore('meta.character', {})
  const [regionData] = useStore('meta.region', {})

  const changedCharacter = useMemo(
    () => applyChangesCharacter(currentCharacter, characterChanges, regionData),
    [regionData, currentCharacter, characterChanges]
  )

  return [
    {
      currentCharacter,
      changedCharacter,
      characterChanges,
      regionData,
    },
    dispatch,
  ]
}

export default useChangedCharacter
