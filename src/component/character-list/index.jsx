import {
  useMemo,
  memo,
  useEffect,
  useCallback,
  useState,
  Fragment,
} from 'react'

/* store */
import { useStore } from '@store'
import {
  CHARACTER_INITIAL,
  CHARACTER_APPEND,
  CHARACTER_REORDER,
} from '@store/character'

/* components */
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Input, Col } from 'antd'
import CharacterItem from './character-item'
import CharacterNew from './character-new'

/* i18n */
import { withTranslation } from '@i18n'

/* utils */
import { includes, pipe, prop } from 'ramda'

import fakeCharacter from './fake-character'

const CharacterList = ({ t }) => {
  const [characters, dispatch] = useStore('character.characters', [])
  const [search, updateSearch] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageCharacters =
        localStorage.getItem('MAPLESALON_characters') &&
        JSON.parse(localStorage.getItem('MAPLESALON_characters'))

      !characters.length &&
        dispatch({
          type: CHARACTER_INITIAL,
          payload: storageCharacters || [],
        })

      /* fake difference */
      // dispatch({
      //   type: UPDATE_CHARACTER,
      //   payload: {
      //     hairId: firstCharacterHair,
      //     hairColorId: getHairColorId(firstCharacterHair) + '',
      //     faceId: firstCharacterFace,
      //     faceColorId: getFaceColorId(firstCharacterFace) + '',
      //     skin: getSkinRegion(firstCharacter.skin),
      //     earsType: getEarsType(firstCharacter),
      //     mixHairColorId: getHairColorId(firstCharacterHair) + '',
      //     // mixHairOpacity: 0.5,
      //   },
      // })
    }
  }, [])
  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return
    dispatch({ type: CHARACTER_REORDER, payload: result })
  }, [])
  console.log(characters, search)

  return useMemo(
    () => (
      <Fragment>
        <Col span={24} sm={18} xl={12} xxl={8}>
          <Input.Search
            placeholder={t('search_character')}
            onChange={({ target: { value } }) => updateSearch(value)}
            allowClear
          />
        </Col>
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
                {characters
                  .filter(pipe(prop('name'), includes(search)))
                  .map((character, index) => (
                    <CharacterItem
                      data={character}
                      index={index}
                      key={character.id}
                      isDragDisabled={!!search}
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
    ),
    [characters, search]
  )
}

CharacterList.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default memo(withTranslation('index')(CharacterList))
