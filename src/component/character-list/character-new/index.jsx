import { useCallback, Fragment, useMemo, useState } from 'react'
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

/* utils */
import { getHairColorId } from '@utils/group-hair'
import { filter, identity, map, mergeRight, pipe, propEq } from 'ramda'

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

const ControlBoard = ({ characterData }) => {
  const dispatch = useDispatch()
  const [isLoading, updateLoadState] = useState(false)
  const handelSelect = useCallback(() => {
    dispatch({ type: CHARACTER_APPEND })
  }, [])
  const { handleUpLoad, handleModal } = useMemo(
    () => ({
      handleUpLoad: (event) => {
        updateLoadState(true)
        const loadPromises = Array.from(event.target.files)
          .filter(propEq('type', 'application/json'))
          .map(LoadCharacter)
        Promise.all(loadPromises)
          .then(pipe(filter(validateCharacter), map(mergeDefaultCharacter)))
          .then((data) => {
            dispatch({ type: CHARACTER_APPEND, payload: data })
            updateLoadState(false)
          })
      },
      handleModal: () => {
        Modal.confirm({ title: 'choice character', content: <span>123</span> })
      },
    }),
    [characterData]
  )
  return (
    <Fragment>
      <div
        className="character-new"
        onDragOver={console.log}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log(e.dataTransfer.files)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        multiple
      >
        <PlusOutlined style={{ fontSize: '36px', color: '#bbb' }} />
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
            Import
          </label>
          <div className="control-board-button" onClick={() => {}}>
            <SnippetsOutlined style={{ fontSize: '32px' }} />
            Select From Template
          </div>
        </div>
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

export default ControlBoard
