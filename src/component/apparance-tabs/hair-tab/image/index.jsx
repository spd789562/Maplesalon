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
  const [{ id: hairId, colorId: hairColorId }, dispatch] = useStore(
    'meta.character.hair'
  )
  const item = data[columnIndex + columnCount * rowIndex] || { colors: {} }
  const itemId = item.colors[hairColorId] && item.colors[hairColorId].id
  const src = `https://maplestory.io/api/${region}/${version}/item/${itemId}/icon`
  const isSelected = hairId && itemId && hairId === itemId
  const handleChange = useCallback(() => {
    const updateData = {
      id: itemId,
      colorId: hairColorId,
      region,
      version,
    }
    dispatch({ type: UPDATE_CHARACTER, payload: { hair: updateData } })
    dispatch({
      type: APPEND_HISTORY,
      payload: {
        type: 'hair',
        name: item.name,
        ...updateData,
      },
    })
  }, [itemId, region, version])
  return (
    <ImageItem
      style={style}
      name={item.name}
      isSelected={isSelected}
      src={src}
      hasItem={!!itemId}
      handleChange={itemId ? handleChange : F}
    />
  )
}

export default Image
