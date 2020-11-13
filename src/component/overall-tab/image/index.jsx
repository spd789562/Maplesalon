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
  const [overall, dispatch] = useStore('meta.character.overall')
  const item = data[columnIndex + columnCount * rowIndex] || {}
  const itemId = item.id
  const src = `https://maplestory.io/api/${region}/${version}/item/${itemId}/icon`
  const isSelected = overall && overall.id && overall.id === itemId
  const handleChange = useCallback(
    (id) => () => {
      dispatch({
        type: UPDATE_CHARACTER,
        payload: { overall: { id, region, version } },
      })
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
        {item.name && itemId && (
          <Fragment>
            <div className="item-icon">
              <img src={src} alt={item.name} />
            </div>
            <figcaption className="item-name">{item.name}</figcaption>
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
          }
        `}</style>
      </figure>
    ),
    [isSelected, item]
  )
}

export default Image
