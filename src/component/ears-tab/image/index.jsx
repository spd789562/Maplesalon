import { Fragment, useCallback, useMemo } from 'react'
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'
import { F } from 'ramda'

const Image = ({ columnIndex, rowIndex, style, data }) => {
  const [{ skin, earsType }, dispatch] = useStore('meta.character')
  const [{ region, version }] = useStore('meta.region')
  const item = data[columnIndex + 4 * rowIndex]
  const itemId = item.id
  const itemName = item.name
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
  return useMemo(
    () => (
      <figure
        style={style}
        className={`item ${isSelected ? 'item__selected' : ''}`}
        onClick={itemId ? handleChange(itemId) : F}
      >
        {item && (
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
            justify-content: center;
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
            word-break: break-all;
          }
        `}</style>
      </figure>
    ),
    [isSelected, item, earsType, skin.id]
  )
}

export default Image
