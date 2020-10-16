import { useCallback, useState, useEffect, useRef, Fragment } from 'react'
import { useStore } from '@store'

/* api */
import { APIGetHair } from '@api'

/* action */
import { HAIR_INITIAL } from '@store/hair'

/* components */
import { Input } from 'antd'
import { FixedSizeGrid } from 'react-window'
import ColorSelect from './color-select'

/* utils */
import groupHair from '@utils/group-hair'
import { debounce } from 'throttle-debounce'

const { Search } = Input

const Image = ({ columnIndex, rowIndex, style, data, region, version }) => {
  const [colorId] = useStore('meta.character.hairColorId')
  const item = data[columnIndex + 5 * rowIndex] || { colors: {} }
  const itemId = item.colors[colorId] && item.colors[colorId].id
  const src = `https://maplestory.io/api/${region}/${version}/item/${itemId}/icon`
  return (
    <figure style={style} className="item">
      <style jsx>{`
        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
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
      `}</style>
      {item.name && itemId && (
        <Fragment>
          <div className="item-icon">
            <img src={src} alt={item.name} />
          </div>
          <figcaption>{item.name}</figcaption>
        </Fragment>
      )}
    </figure>
  )
}

const HairTab = () => {
  const container = useRef(null)
  const [hairs, dispatch] = useStore('hair')
  const [{ region, version }] = useStore('meta.region')
  const hairsValues = Object.values(hairs)
  const [beforeSarchHairs, updateSearchedHair] = useState(hairsValues)
  useEffect(() => {
    if (region && version)
      APIGetHair({ region, version }).then((data) =>
        dispatch({ type: HAIR_INITIAL, payload: groupHair(data) })
      )
  }, [region, version])
  const handleSearch = useCallback(
    debounce(250, (value) => {
      console.log(value)
      updateSearchedHair(
        value
          ? hairsValues.filter(({ name }) => name.indexOf(value) !== -1)
          : hairsValues
      )
    }),
    [hairsValues]
  )
  const width = container?.current?.offsetWidth || 300
  const perWidth = width / 5
  return (
    <div ref={container}>
      <Search
        placeholder="type_hair_name"
        onChange={({ target: { value } }) => handleSearch(value)}
        style={{ width: '100%' }}
      />
      <FixedSizeGrid
        columnCount={5}
        columnWidth={perWidth}
        rowCount={beforeSarchHairs.length / 5}
        rowHeight={95}
        width={width}
        height={300}
        itemData={beforeSarchHairs}
      >
        {({ columnIndex, rowIndex, data, style }) => {
          return (
            <Image
              {...{
                data,
                style,
                columnIndex,
                rowIndex,
                region,
                version,
              }}
            />
          )
        }}
      </FixedSizeGrid>
      <ColorSelect />
    </div>
  )
}

export default HairTab
