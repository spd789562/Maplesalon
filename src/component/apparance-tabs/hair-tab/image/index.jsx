import { useCallback } from 'react'
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'
import { F } from 'ramda'

import ImageItem from '../../image-item'

const Image = ({
  columnIndex,
  rowIndex,
  style,
  data,
  region,
  version,
  columnCount,
}) => {
  const [{ hairColorId, hairId }, dispatch] = useStore('meta.character')
  const item = data[columnIndex + columnCount * rowIndex] || { colors: {} }
  const itemId = item.colors[hairColorId] && item.colors[hairColorId].id
  const src = `https://maplestory.io/api/${region}/${version}/item/${itemId}/icon`
  const isSelected = hairId && itemId && hairId === itemId
  const handleChange = useCallback(
    (id) => () => {
      dispatch({ type: UPDATE_CHARACTER, payload: { hairId: id } })
    },
    []
  )
  return (
    <ImageItem
      style={style}
      name={item.name}
      isSelected={isSelected}
      src={src}
      hasItem={!!itemId}
      handleChange={itemId ? handleChange(itemId) : F}
    />
  )
}

export default Image
