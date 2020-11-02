import { Fragment } from 'react'

/* components */
import { Draggable } from 'react-beautiful-dnd'
import CharacterImage from '@components/character-image'
import ControlBoard from './control-board'

const CharacterItem = ({ data, index, isDragDisabled }) => (
  <Fragment>
    <Draggable
      draggableId={data.id.toString()}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, dragSnapshot) => (
        <div
          ref={(ref) => provided.innerRef(ref)}
          className={`drag-item ${
            dragSnapshot.isDragging ? 'drag-item__isdrag' : ''
          }`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <CharacterImage characterData={data} />
          {data.name}
          <ControlBoard characterData={data} />
        </div>
      )}
    </Draggable>
    <style jsx>{`
      .drag-item {
        width: 120px;
        flex-shrink: 0;
        padding-right: 8px;
        padding-left: 8px;
        outline: none;
        text-align: center;
        position: relative;
      }
      .drag-item__isdrag {
        border: 2px solid #000;
      }
    `}</style>
  </Fragment>
)

export default CharacterItem
