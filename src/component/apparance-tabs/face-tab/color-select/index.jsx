import { memo, useMemo, useCallback } from 'react'
import { useStore } from '@store'

/* action */
import { UPDATE_CHARACTER } from '@store/meta'

/* helper */
import { formatFaceId } from '@utils/group-face'
import { keys, includes, F } from 'ramda'

const colors = [
  { id: '0', color: '#000' },
  { id: '1', color: '#2d7fcc' },
  { id: '2', color: '#ff5959' },
  { id: '3', color: '#a0d893' },
  { id: '4', color: '#f5e239' },
  { id: '5', color: '#53c2d1' },
  { id: '6', color: '#b393d8' },
  { id: '7', color: '#cb31ac' },
  { id: '8', color: '#cdcdcd' },
]

const ColorSelect = () => {
  const [{ id: faceId, colorId: faceColorId }, dispatch] = useStore(
    'meta.character.face'
  )
  const [{ region, version }] = useStore('meta.region')
  const [faces] = useStore('face')
  const currentFace = useMemo(
    () => (faceId ? faces[formatFaceId(faceId)] : { colors: {} }),
    [faces, faceId]
  )

  const hasThisColor = useCallback(
    (id) =>
      faceId && currentFace ? includes(id, keys(currentFace.colors)) : true,
    [faces, faceId]
  )

  const handleChange = useCallback(
    ({ target: { value: faceColorId } }) => {
      const hasColor = currentFace.colors[faceColorId]
      dispatch({
        type: UPDATE_CHARACTER,
        payload: {
          face: {
            id: hasColor ? hasColor.id : faceId,
            colorId: faceColorId,
            region,
            version,
          },
          mixFaceColorId: faceColorId,
        },
      })
    },
    [currentFace, faceId, region, version]
  )
  return (
    <ul className="select">
      {colors.map(({ id, color }) => (
        <li className="select-item" key={`face-select-${id}`}>
          <input
            type="radio"
            name="select"
            id={`color-select-${id}`}
            className="select-item-checkbox"
            value={id}
            checked={id === faceColorId}
            onChange={handleChange}
          />
          <label
            htmlFor={`color-select-${id}`}
            className={`select-item-block ${
              hasThisColor(id) ? '' : 'select-item-block__none'
            }`}
            style={{ backgroundColor: color }}
          />
        </li>
      ))}
      <style jsx>{`
        .select {
          display: flex;
          margin: 0;
          margin-top: 8px;
          padding: 0;
          list-style: none;
        }
        .select-item {
          flex: 1;
        }
        .select-item-checkbox {
          display: none;
        }
        .select-item-checkbox:checked + .select-item-block:before {
          border-bottom-color: #fff;
          border-right-color: #fff;
        }
        .select-item-block {
          display: block;
          width: 100%;
          padding-bottom: 100%;
          position: relative;
        }
        .select-item-block:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 53%;
          transform: translate(-60%, -60%) rotate(45deg);
          width: 30%;
          height: 50%;
          border: 2px solid transparent;
        }
        .select-item-block__none {
          filter: contrast(0.5);
        }
      `}</style>
    </ul>
  )
}

export default memo(ColorSelect)
