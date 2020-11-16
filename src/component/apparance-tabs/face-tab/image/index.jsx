import { Fragment, useCallback, useMemo } from 'react'
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'
import { F } from 'ramda'

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
  return useMemo(
    () => (
      <figure
        style={style}
        className={`item ${isSelected ? 'item__selected' : ''}`}
        onClick={itemId ? handleChange(itemId) : F}
      >
        {itemId && (
          <Fragment>
            <div className="item-icon">
              <img src={src} alt={itemName} />
            </div>
            <figcaption className="item-name">{itemName}</figcaption>
          </Fragment>
        )}
        <style jsx>{`
          .item {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
          }
          .item__selected {
            background-color: #c1c8f1;
          }
          .item-icon {
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .item-icon > img {
            max-height: 100%;
          }
          .item-name {
            padding-left: 8px;
            padding-right: 8px;
            text-align: center;
          }
        `}</style>
      </figure>
    ),
    [isSelected, item]
  )
}

export default Image
