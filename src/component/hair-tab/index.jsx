import { memo, useMemo, useState, useEffect, useRef } from 'react'
import { useStore } from '@store'

/* api */
import { APIGetHair } from '@api'

/* action */
import { HAIR_INITIAL } from '@store/hair'
import { CHANGE_DATA_REGION } from '@store/meta'

/* components */
import { FixedSizeGrid } from 'react-window'
import ColorSelect from './color-select'
import Search from './search'
import Image from './image'

/* utils */
import groupHair, { formatHairId } from '@utils/group-hair'
import { propEq } from 'ramda'

const HairTab = () => {
  const container = useRef(null)
  const [hairs, dispatch] = useStore('hair')
  const [{ region, version, hair: hairRegion }] = useStore('meta.region')
  const [{ hairColorId: colorId, hairId }] = useStore('meta.character', '')
  const hairsValues = useMemo(() => Object.values(hairs), [hairs])
  const [beforeSarchHairs, updateSearchedHair] = useState(hairsValues)
  const [searchParam] = useStore('search.hair')

  useEffect(() => {
    if (region && version && region !== hairRegion) {
      APIGetHair({ region, version }).then((data) => {
        dispatch({ type: HAIR_INITIAL, payload: groupHair(data) })
        dispatch({
          type: CHANGE_DATA_REGION,
          payload: {
            field: 'hair',
            region,
          },
        })
      })
    }
  }, [region, version])
  useEffect(() => {
    updateSearchedHair(
      hairsValues
        .filter(({ colors }) => colors && colors[colorId])
        .filter(
          ({ name, colors: { [colorId]: { requiredGender } = {} } }) =>
            name.indexOf(searchParam.name) !== -1 &&
            (!searchParam.gender || requiredGender === +searchParam.gender)
        )
    )
  }, [hairsValues, searchParam, colorId])
  const initHeight = useMemo(() => {
    const index = beforeSarchHairs.findIndex(propEq('id', formatHairId(hairId)))
    return index !== -1 ? (Math.floor(index / 5) - 1) * 95 : 0
  }, [beforeSarchHairs, hairId])
  const width = container?.current?.offsetWidth || 300
  const perWidth = width / 5
  return (
    <div ref={container}>
      <Search />
      <FixedSizeGrid
        columnCount={5}
        columnWidth={perWidth}
        rowCount={Math.ceil(beforeSarchHairs.length / 5)}
        rowHeight={95}
        width={width}
        height={300}
        itemData={beforeSarchHairs}
        initialScrollTop={initHeight}
        key={beforeSarchHairs.length}
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

export default memo(HairTab)
