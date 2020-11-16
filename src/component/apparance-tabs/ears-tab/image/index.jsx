import { Fragment, useCallback, useMemo } from 'react'
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'
import { F } from 'ramda'
import { withTranslation } from '@i18n'

import ImageItem from '../../image-item'

const Image = ({ columnIndex, rowIndex, style, data, t }) => {
  const [{ skin, earsType }, dispatch] = useStore('meta.character')
  const [{ region, version }] = useStore('meta.region')
  const item = data[columnIndex + 4 * rowIndex] || {}
  const itemId = item.id
  const itemName = t(item.name)
  const src = `https://maplestory.io/api/${
    skin.region ? `${skin.region}/${skin.version}` : `${region}/${version}`
  }/character/${skin.id || 2000}?${item.query ? `${item.query}=true` : ''}`
  const isSelected = itemId === earsType
  const handleChange = useCallback(
    (id) => () => {
      dispatch({ type: UPDATE_CHARACTER, payload: { earsType: id } })
    },
    []
  )
  return (
    <ImageItem
      paddingTop={10}
      style={style}
      name={itemName}
      isSelected={isSelected}
      src={src}
      hasItem={!!itemId}
      handleChange={itemId ? handleChange(itemId) : F}
    />
  )
}

Image.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(Image)
