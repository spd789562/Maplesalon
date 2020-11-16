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
  const [{ faceColorId, faceId }, dispatch] = useStore('meta.character')
  const item = data[columnIndex + columnCount * rowIndex] || { colors: {} }
  const itemId = item.colors[faceColorId] && item.colors[faceColorId].id
  const itemName =
    item.name ||
    (item.colors[faceColorId] && item.colors[faceColorId].name) ||
    ''
  const src = `https://maplestory.io/api/${region}/${version}/item/${itemId}/icon`
  const isSelected = faceId && itemId && faceId === itemId
  const handleChange = useCallback(
    (id) => () => {
      dispatch({ type: UPDATE_CHARACTER, payload: { faceId: id } })
    },
    []
  )
  return (
    <ImageItem
      style={style}
      name={itemName}
      isSelected={isSelected}
      src={src}
      hasItem={!!itemId}
      handleChange={itemId ? handleChange(itemId) : F}
    />
  )
}

export default Image
