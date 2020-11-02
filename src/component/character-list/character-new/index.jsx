import { useCallback, Fragment, useMemo, useState, useContext } from 'react'
/* action */
import { useDispatch } from '@store'
import { CHARACTER_APPEND } from '@store/character'

/* components */
import {
  PlusOutlined,
  ImportOutlined,
  SnippetsOutlined,
  Loading3QuartersOutlined,
} from '@ant-design/icons'
import { Modal } from 'antd'
import DefaultCharacter from './default-character'

/* i18n */
import { withTranslation } from '@i18n'

/* utils */
import importCharactersFromFile from '@utils/import-characters-from-file'

const CharacterNew = ({ t }) => {
  const dispatch = useDispatch()
  const [isLoading, updateLoadState] = useState(false)
  const [isDragOver, updateDragState] = useState(false)
  const [modalVisible, updateModalVisible] = useState(false)
  const [selectCharacter, selectDefaultCharacter] = useState(null)
  const importFile = useCallback((files) => {
    updateLoadState(true)
    importCharactersFromFile(files).then((data) => {
      dispatch({ type: CHARACTER_APPEND, payload: data })
      updateLoadState(false)
    })
  }, [])
  const { handleOpenModal, handleCancel, handleOk } = useMemo(
    () => ({
      handleOpenModal: () => updateModalVisible(true),
      handleCancel: () => {
        updateModalVisible(false)
        selectDefaultCharacter(null)
      },
      handleOk: () => {
        updateModalVisible(false)
        dispatch({ type: CHARACTER_APPEND, payload: [selectCharacter] })
        selectDefaultCharacter(null)
      },
    }),
    [selectCharacter]
  )
  const { handleUpLoad, handleDrop, handleDragOver, handleDragLeave } = useMemo(
    () => ({
      handleUpLoad: (event) => {
        if (event.target.files.length) importFile(event.target.files)
      },
      handleDrop: (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (event.dataTransfer && event.dataTransfer.files.length)
          importFile(event.dataTransfer.files)
        updateDragState(false)
      },
      handleDragOver: (event) => {
        event.preventDefault()
        event.stopPropagation()
        updateDragState(true)
      },
      handleDragLeave: (event) => {
        event.preventDefault()
        event.stopPropagation()
        updateDragState(false)
      },
    }),
    []
  )
  return (
    <Fragment>
      <div
        className={`character-new ${
          isDragOver ? 'character-new__dragover' : ''
        }`}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        multiple
      >
        <PlusOutlined style={{ fontSize: '36px', color: '#bbb' }} />
        <Modal
          title={t('import_template_title')}
          okText={t('import_template_ok')}
          cancelText={t('import_template_cancel')}
          visible={modalVisible}
          width={600}
          centered
          onCancel={handleCancel}
          onOk={handleOk}
        >
          <DefaultCharacter
            id={(selectCharacter && selectCharacter.id) || ''}
            handleSelect={selectDefaultCharacter}
          />
        </Modal>
        {!isDragOver && (
          <div className="control-board">
            <label className="control-board-button">
              <input
                className="import-input"
                type="file"
                onChange={handleUpLoad}
                accept=".json"
                multiple
              />
              <ImportOutlined style={{ fontSize: '32px' }} />
              {t('import_import')}
            </label>
            <div className="control-board-button" onClick={handleOpenModal}>
              <SnippetsOutlined style={{ fontSize: '32px' }} />
              {t('import_template')}
            </div>
          </div>
        )}
        {isLoading && (
          <div className="file-loading">
            <Loading3QuartersOutlined style={{ fontSize: '42px' }} spin />
          </div>
        )}
      </div>
      <style jsx>{`
        .character-new {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 25%;
          max-width: 120px;
          flex-shrink: 0;
          transition: background-color 0.3s linear;
        }
        .character-new:before {
          content: '';
          display: block;
          position: absolute;
          top: 12px;
          left: 8px;
          bottom: 12px;
          right: 8px;
          border: 2px dashed #bbb;
          transition: border-color 0.3s linear;
        }
        .character-new__dragover {
          background-color: #dedede;
        }
        .character-new__dragover:before {
          border-color: #aaa;
        }
        .import-input {
          display: none;
          visibility: hidden;
          opacity: 0;
        }
        .control-board {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .control-board:hover,
        .control-board:focus {
          opacity: 1;
        }
        .control-board-button {
          width: 100%;
          flex: 1;
          position: relative;
          opacity: 0.5;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          text-align: center;
          cursor: pointer;
          padding: 0 8px;
        }
        .control-board-button:nth-child(1) {
          background-color: #c1c8f1;
        }
        .control-board-button:nth-child(2) {
          background-color: #fbc965;
        }
        .control-board-button:hover {
          opacity: 0.9;
        }
        .file-loading {
          color: #999;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          background-color: hsla(0, 100%, 100%, 0.5);
        }
      `}</style>
    </Fragment>
  )
}

CharacterNew.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(CharacterNew)
