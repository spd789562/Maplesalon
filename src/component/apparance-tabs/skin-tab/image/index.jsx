import { Fragment, useCallback, useMemo } from 'react'
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'
import { APPEND_HISTORY } from '@store/history'
import { F } from 'ramda'
import { withTranslation } from '@i18n'

import ImageItem from '../../image-item'

const Image = ({ columnIndex, rowIndex, style, data, t }) => {
  const [skinId, dispatch] = useStore('meta.character.skin.id')
  const item = data[columnIndex + 4 * rowIndex] || {}
  const itemId = item.id
  const itemName = t(item.name)
  const src = `https://maplestory.io/api/${item.region}/${item.version}/character/${itemId}`
  const isSelected = itemId === skinId
  const handleChange = useCallback(
    (data) => () => {
      dispatch({ type: UPDATE_CHARACTER, payload: { skin: data } })
      dispatch({
        type: APPEND_HISTORY,
        payload: {
          type: 'skin',
          name: item.name,
          translate: true,
          ...data,
        },
      })
    },
    []
  )
  return (
    <ImageItem
      style={style}
      paddingTop={10}
      name={itemName}
      isSelected={isSelected}
      src={src}
      hasItem={!!itemId}
      handleChange={itemId ? handleChange(item) : F}
    />
  )
}

Image.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(Image)
