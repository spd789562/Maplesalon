import { useCallback, Fragment } from 'react'
/* action */
import { useStore } from '@store'
import { CHARACTER_CHANGE } from '@store/character'
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Draggable } from 'react-beautiful-dnd'
import CharacterImage from '@components/character-image'

/* utils */
import { getHairColorId } from '@utils/group-hair'

const CharacterItem = ({ data, index }) => {
  const [currentCharacter, dispatch] = useStore('character.current')
  const handleChangeCharacter = useCallback(
    (character) => () => {
      dispatch({ type: CHARACTER_CHANGE, payload: character.id })
      if (character.selectedItems.Hair?.id) {
        dispatch({
          type: UPDATE_CHARACTER,
          payload: {
            hairId: character.selectedItems.Hair.id,
            hairColoId: getHairColorId(character.selectedItems.Hair.id),
          },
        })
      }
    },
    []
  )
  return (
    <Fragment>
      <Draggable draggableId={data.id.toString()} index={index}>
        {(provided, dragSnapshot) => (
          <div
            ref={(ref) => provided.innerRef(ref)}
            className={`drag-item ${
              dragSnapshot.isDragging ? 'drag-item__isdrag' : ''
            }`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={handleChangeCharacter(data)}
          >
            <CharacterImage characterData={data} />
          </div>
        )}
      </Draggable>
      <style jsx>{`
        .drag-item {
          width: 25%;
          max-width: 120px;
          flex-shrink: 0;
          margin-right: 8;
          outline: none;
        }
        .drag-item__isdrag {
          border: 2px solid #000;
        }
      `}</style>
    </Fragment>
  )
}

export default CharacterItem
