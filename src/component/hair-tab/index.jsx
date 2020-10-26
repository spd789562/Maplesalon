import { memo, useMemo, useState, useEffect, createRef } from 'react'
import { useStore } from '@store'

/* api */
import { APIGetHair } from '@api'

/* action */
import { HAIR_INITIAL } from '@store/hair'
import { SEARCH_UPDATE } from '@store/search'
import { CHANGE_DATA_REGION } from '@store/meta'

/* components */
import { FixedSizeGrid } from 'react-window'
import ColorSelect from './color-select'
import Search from './search'
import Image from './image'

/* utils */
import groupHair, { formatHairId } from '@utils/group-hair'
import { propEq } from 'ramda'

const hairRef = createRef()

const HairTab = () => {
  const [hairs, dispatch] = useStore('hair')
  const [{ region, version, hair: hairRegion }] = useStore('meta.region')
  const [{ hairColorId: colorId, hairId }] = useStore('meta.character', '')
  const [searchParam] = useStore('search.hair')
  const [width] = useStore('search.tabWidth')

  const hairsValues = useMemo(() => Object.values(hairs), [hairs])
  const [beforeSarchHairs, updateSearchedHair] = useState(hairsValues)

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
  useEffect(
    () => () => {
      dispatch({
        type: SEARCH_UPDATE,
        payload: {
          type: 'hair',
          field: 'scrollTop',
          value: hairRef?.current?.state?.scrollTop || 0,
        },
      })
    },
    []
  )
  const initHeight = useMemo(() => {
    if (searchParam.scrollTop) {
      return searchParam.scrollTop
    } else {
      const index = beforeSarchHairs.findIndex(
        propEq('id', formatHairId(hairId))
      )
      return index !== -1 ? (Math.floor(index / 5) - 1) * 95 : 0
    }
  }, [beforeSarchHairs, hairId])
  const perWidth = width / 5
  return (
    <div>
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
        ref={hairRef}
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
