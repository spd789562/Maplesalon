import { useCallback } from 'react'
import { useStore } from '@store'

/* action */
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Radio } from 'antd'

const colors = [
  { id: '0', color: 'rgb(68, 68, 68)' },
  { id: '1', color: 'rgb(255, 89, 89)' },
  { id: '2', color: 'rgb(255, 185, 99)' },
  { id: '3', color: 'rgb(255, 250, 132)' },
  { id: '4', color: 'rgb(160, 216, 147)' },
  { id: '5', color: 'rgb(147, 183, 216)' },
  { id: '6', color: 'rgb(179, 147, 216)' },
  { id: '7', color: 'rgb(135, 107, 78)' },
]

const ColorSelect = () => {
  const [id, dispatch] = useStore('meta.character.hairColorId')
  const handleChange = useCallback(
    ({ target: { value: hairColorId } }) =>
      dispatch({ type: UPDATE_CHARACTER, payload: { hairColorId } }),
    []
  )
  return (
    <Radio.Group onChange={handleChange} defaultValue={id}>
      {colors.map(({ id, color }) => (
        <Radio.Button
          value={id}
          key={`hair-select-${id}`}
          style={{ padding: 0 }}
        >
          <div style={{ width: 30, height: 30, backgroundColor: color }}></div>
        </Radio.Button>
      ))}
    </Radio.Group>
  )
}

export default ColorSelect
