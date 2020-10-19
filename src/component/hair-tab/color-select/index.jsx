import { useMemo, useCallback } from 'react'
import { useStore } from '@store'

/* action */
import { UPDATE_CHARACTER } from '@store/meta'

/* helper */
import { formatHairId } from '@utils/group-hair'
import { keys, includes } from 'ramda'

const colors = [
  { id: '0', color: 'rgb(68, 68, 68)' },
  { id: '1', color: 'rgb(255, 89, 89)' },
  { id: '2', color: 'rgb(255, 185, 99)' },
  { id: '3', color: 'rgb(245, 226, 57)' },
  { id: '4', color: 'rgb(160, 216, 147)' },
  { id: '5', color: 'rgb(147, 183, 216)' },
  { id: '6', color: 'rgb(179, 147, 216)' },
  { id: '7', color: 'rgb(135, 107, 78)' },
]

const ColorSelect = () => {
  const [{ hairColorId, hairId }, dispatch] = useStore('meta.character')
  const [hairs] = useStore('hair')
  const currentHair = useMemo(
    () => (hairId ? hairs[formatHairId(hairId)] : { colors: {} }),
    [hairs, hairId]
  )
  const hasThisColor = useCallback(
    (id) => (hairId ? includes(id, keys(currentHair.colors)) : true),
    [hairs, hairId]
  )

  const handleChange = useCallback(
    ({ target: { value: hairColorId } }) => {
      const hasColor = currentHair.colors[hairColorId]
      dispatch({
        type: UPDATE_CHARACTER,
        payload: { hairColorId, hairId: hasColor ? hasColor.id : hairId },
      })
    },
    [currentHair, hairId]
  )
  return (
    <ul className="select">
      {colors.map(({ id, color }) => (
        <li className="select-item" key={`hair-select-${id}`}>
          <input
            type="radio"
            name="select"
            id={`color-select-${id}`}
            className="select-item-checkbox"
            value={id}
            defaultChecked={id === hairColorId}
            onChange={handleChange}
          />
          <label
            for={`color-select-${id}`}
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

export default ColorSelect
