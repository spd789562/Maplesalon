import { useMemo, memo, useEffect } from 'react'

/* store */
import { useStore } from '@store'
import { CHARACTER_APPEND, CHARACTER_CHANGE } from '@store/character'
import { UPDATE_CHARACTER } from '@store/meta'

import fakeCharacter from './fake-character'

const CharacterList = () => {
  const [characters, dispatch] = useStore('character.characters', [])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageCharacters = (localStorage.getItem(
        'MAPLESALON_characters'
      ) &&
        JSON.parse(localStorage.getItem('MAPLESALON_characters'))) || [
        fakeCharacter,
      ]
      dispatch({
        type: CHARACTER_APPEND,
        payload: storageCharacters,
      })
      dispatch({
        type: CHARACTER_CHANGE,
        payload: storageCharacters[0].id,
      })
      /* fake difference */
      dispatch({
        type: UPDATE_CHARACTER,
        payload: {
          skinId: '2001',
          mixHairColorId: '2',
          mixHairOpacity: 0.5,
        },
      })
    }
  }, [])
  console.log(characters)
  return <div></div>
}

export default memo(CharacterList)
