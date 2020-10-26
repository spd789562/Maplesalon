import { useMemo, memo, useEffect, useCallback, Fragment } from 'react'

/* store */
import { useStore } from '@store'
import {
  CHARACTER_APPEND,
  CHARACTER_CHANGE,
  CHARACTER_REORDER,
} from '@store/character'
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import CharacterImage from '@components/character-image'
import CharacterItem from './character-item'
import CharacterNew from './character-new'

/* utils */
import { getHairColorId } from '@utils/group-hair'
import { getFaceColorId } from '@utils/group-face'
import getSkinRegion from '@utils/get-skin-region'
import getEarsType from '@utils/get-ears-type'
import { clone } from 'ramda'

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
      const firstCharacter = storageCharacters[0] || {}
      const firstCharacterHair =
        storageCharacters[0]?.selectedItems?.Hair.id || ''
      const firstCharacterFace =
        storageCharacters[0]?.selectedItems?.Face.id || ''

      !characters.length &&
        dispatch({
          type: CHARACTER_APPEND,
          payload: Array.from(Array(8))
            .map((_, index) => ({
              ...clone(firstCharacter),
              id: firstCharacter.id + index,
            }))
            .map((c, index) => {
              c.selectedItems.Hair.id = c.selectedItems.Hair.id + index
              return c
            }),
        })
      /* fake difference */
      dispatch({
        type: UPDATE_CHARACTER,
        payload: {
          hairId: firstCharacterHair,
          hairColorId: getHairColorId(firstCharacterHair) + '',
          faceId: firstCharacterFace,
          faceColorId: getFaceColorId(firstCharacterFace) + '',
          skin: getSkinRegion(firstCharacter.skin),
          earsType: getEarsType(firstCharacter),
          // mixHairColorId: '1',
          // mixHairOpacity: 0.5,
        },
      })
    }
  }, [])
  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return
    dispatch({ type: CHARACTER_REORDER, payload: result })
  }, [])
  return (
    <Fragment>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="characters"
          direction="horizontal"
          isCombineEnabled={false}
        >
          {(dropProvided, dropSnapshot) => (
            <div
              ref={(ref) => dropProvided.innerRef(ref)}
              className="drop"
              {...dropProvided.droppableProps}
            >
              {characters.map((character, index) => (
                <CharacterItem
                  data={character}
                  index={index}
                  key={character.id}
                />
              ))}
              {dropProvided.placeholder}
              <CharacterNew />
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <style jsx>{`
        .drop {
          overflow-x: auto;
          display: flex;
          height: 200px;
        }
      `}</style>
    </Fragment>
  )
}

export default memo(CharacterList)
