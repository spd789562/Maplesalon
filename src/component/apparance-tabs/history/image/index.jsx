import { useCallback } from 'react'
import { UPDATE_CHARACTER } from '@store/meta'
import { F } from 'ramda'
import { withTranslation } from '@i18n'

import ImageItem from '../../image-item'

import useItem from './use-item'

const Image = ({ columnIndex, rowIndex, style, data, columnCount, t }) => {
  const item = data[columnIndex + columnCount * rowIndex] || {}
  const { iconSrc: src, handleChange } = useItem(item)
  const itemId = item.id
  const itemName = item.translate ? t(item.name) : item.name
  return (
    <ImageItem
      style={style}
      name={itemName}
      src={src}
      hasItem={!!itemId}
      handleChange={itemId ? handleChange : F}
    />
  )
}

Image.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(Image)
