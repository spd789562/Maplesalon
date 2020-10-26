import { useCallback, Fragment, useMemo } from 'react'
/* action */
import { useDispatch } from '@store'
import {
  CHARACTER_CHANGE,
  CHARACTER_DUPLICATE,
  CHARACTER_DELETE,
} from '@store/character'
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { SelectOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons'

/* utils */
import { getHairColorId } from '@utils/group-hair'

const ControlBoard = ({ characterData }) => {
  const dispatch = useDispatch()
  const { handleChange, handleDuplicate, handleDelete } = useMemo(
    () => ({
      handleChange: () => {
        dispatch({ type: CHARACTER_CHANGE, payload: characterData.id })
        if (characterData.selectedItems.Hair?.id) {
          dispatch({
            type: UPDATE_CHARACTER,
            payload: {
              hairId: characterData.selectedItems.Hair.id,
              hairColorId: getHairColorId(characterData.selectedItems.Hair.id),
            },
          })
        }
      },
      handleDuplicate: () =>
        dispatch({ type: CHARACTER_DUPLICATE, payload: characterData.id }),
      handleDelete: () =>
        dispatch({ type: CHARACTER_DELETE, payload: characterData.id }),
    }),
    [characterData]
  )
  return (
    <Fragment>
      <div className="control-board">
        <div
          className="control-board-button control-board-button__full"
          onClick={handleChange}
        >
          <SelectOutlined style={{ fontSize: '32px' }} />
          Select
        </div>
        <div className="control-board-button" onClick={handleDuplicate}>
          <CopyOutlined style={{ fontSize: '24px' }} />
          Duplicate
        </div>
        <div className="control-board-button" onClick={handleDelete}>
          <DeleteOutlined style={{ fontSize: '24px' }} />
          Delete
        </div>
      </div>
      <style jsx>{`
        .control-board {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .control-board:hover,
        .control-board:focus {
          opacity: 1;
        }
        .control-board-button {
          width: 50%;
          position: relative;
          opacity: 0.5;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        .control-board-button__full {
          width: 100%;
        }
        .control-board-button:nth-child(1) {
          background-color: #c1c8f1;
        }
        .control-board-button:nth-child(2) {
          background-color: #fbc965;
        }
        .control-board-button:nth-child(3) {
          background-color: #fc4d4f;
        }
        .control-board-button:hover {
          opacity: 0.9;
        }
      `}</style>
    </Fragment>
  )
}

export default ControlBoard
