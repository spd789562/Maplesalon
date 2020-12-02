import { useCallback } from 'react'
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'
import { APPEND_HISTORY } from '@store/history'
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
  const [{ id: faceId, colorId: faceColorId }, dispatch] = useStore(
    'meta.character.face'
  )
  const item = data[columnIndex + columnCount * rowIndex] || { colors: {} }
  const itemId = item.colors[faceColorId] && item.colors[faceColorId].id
  const itemName =
    item.name ||
    (item.colors[faceColorId] && item.colors[faceColorId].name) ||
    ''
  const src = `https://maplestory.io/api/${region}/${version}/item/${itemId}/icon`
  const isSelected = faceId && itemId && faceId === itemId

  const handleChange = useCallback(() => {
    const updateData = {
      id: itemId,
      colorId: faceColorId,
      region,
      version,
    }
    dispatch({ type: UPDATE_CHARACTER, payload: { face: updateData } })
    dispatch({
      type: APPEND_HISTORY,
      payload: {
        type: 'face',
        name: itemName,
        ...updateData,
      },
    })
  }, [itemId, region, version])
  return (
    <ImageItem
      style={style}
      name={itemName}
      isSelected={isSelected}
      src={src}
      hasItem={!!itemId}
      handleChange={itemId ? handleChange : F}
    />
  )
}

export default Image
