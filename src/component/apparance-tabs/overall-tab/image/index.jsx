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
  const [overall, dispatch] = useStore('meta.character.overall')
  const item = data[columnIndex + columnCount * rowIndex] || {}
  const itemId = item.id
  const src = `https://maplestory.io/api/${region}/${version}/item/${itemId}/icon`
  const isSelected = overall && overall.id && overall.id === itemId
  const handleChange = useCallback(() => {
    const updateData = {
      id: itemId,
      region,
      version,
    }
    dispatch({
      type: UPDATE_CHARACTER,
      payload: { overall: updateData },
    })
    dispatch({
      type: APPEND_HISTORY,
      payload: {
        type: 'overall',
        name: item.name,
        ...updateData,
      },
    })
  }, [])
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
