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
import {
  SelectOutlined,
  DeleteOutlined,
  CopyOutlined,
  DownloadOutlined,
} from '@ant-design/icons'

/* i18n */
import { withTranslation } from '@i18n'

/* utils */
import getCharacterUpdateData from '@utils/get-character-update-data'

const ControlBoard = ({ characterData, t }) => {
  const dispatch = useDispatch()
  const { handleChange, handleDuplicate, handleDelete } = useMemo(
    () => ({
      handleChange: () => {
        dispatch({ type: CHARACTER_CHANGE, payload: characterData.id })
        if (characterData.selectedItems.Hair?.id) {
          dispatch({
            type: UPDATE_CHARACTER,
            payload: getCharacterUpdateData(characterData),
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
          title={t('control_select')}
          className="control-board-button"
          onClick={handleChange}
        >
          <SelectOutlined style={{ fontSize: '24px' }} />
        </div>
        <div title={t('control_export')} className="control-board-button">
          <DownloadOutlined style={{ fontSize: '24px' }} />
        </div>
        <div
          title={t('control_duplicate')}
          className="control-board-button"
          onClick={handleDuplicate}
        >
          <CopyOutlined style={{ fontSize: '24px' }} />
        </div>
        <div
          title={t('control_delete')}
          className="control-board-button"
          onClick={handleDelete}
        >
          <DeleteOutlined style={{ fontSize: '24px' }} />
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
          background-color: #8ed66c;
        }
        .control-board-button:nth-child(3) {
          background-color: #fbc965;
        }
        .control-board-button:nth-child(4) {
          background-color: #fc4d4f;
        }
        .control-board-button:hover {
          opacity: 0.9;
        }
      `}</style>
    </Fragment>
  )
}

ControlBoard.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(ControlBoard)
