import { memo, useMemo, useState, useEffect, createRef } from 'react'
import { useStore } from '@store'

/* action */
import { SEARCH_UPDATE } from '@store/search'

/* components */
import { FixedSizeGrid } from 'react-window'
import ColorSelect from './color-select'
import Search from './search'
import Image from './image'

/* hooks */
import { useHairCheck } from '@hooks/use-check-data'

/* utils */
import { formatHairId } from '@utils/group-hair'
import { propEq } from 'ramda'

const hairRef = createRef()

const HairTab = () => {
  const [isFirstRender, updateFirstRender] = useState(true)
  const [hairs, dispatch] = useStore('hair')
  const { region, version, hair: hairRegion } = useHairCheck()
  const [{ id: hairId, colorId }] = useStore('meta.character.hair', '')
  const [searchParam] = useStore('search.hair')
  const [width] = useStore('search.tabWidth')

  const hairsValues = useMemo(() => Object.values(hairs), [hairs])

  const searchedHair = hairsValues
    .filter(({ colors }) => colors && colors[colorId])
    .filter(
      ({ name, colors: { [colorId]: { requiredGender } = {} } }) =>
        name.toUpperCase().indexOf(searchParam.name.toUpperCase()) !== -1 &&
        (!searchParam.gender || requiredGender === +searchParam.gender)
    )
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
  const CLOUMN_COUNT = width < 400 ? 4 : 5
  const initHeight = useMemo(() => {
    if (searchParam.scrollTop && isFirstRender) {
      updateFirstRender(false)
      return searchParam.scrollTop
    } else {
      const index = searchedHair.findIndex(propEq('id', formatHairId(hairId)))
      return index !== -1 ? (Math.floor(index / CLOUMN_COUNT) - 1) * 95 : 0
    }
  }, [searchedHair.length, colorId, CLOUMN_COUNT])
  const renderKey = useMemo(() => Math.random().toString(36).slice(2, 7), [
    // hairId,
    initHeight,
  ])
  const perWidth = width / CLOUMN_COUNT
  return (
    <div>
      <Search />
      <FixedSizeGrid
        columnCount={CLOUMN_COUNT}
        columnWidth={perWidth}
        rowCount={Math.ceil(searchedHair.length / CLOUMN_COUNT)}
        rowHeight={95}
        width={width}
        height={300}
        itemData={searchedHair}
        initialScrollTop={initHeight}
        key={`hair-${renderKey}-${hairRegion}`}
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
                columnCount: CLOUMN_COUNT,
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
