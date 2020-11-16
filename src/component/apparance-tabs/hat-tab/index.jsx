import { memo, useMemo, useState, useEffect, createRef } from 'react'
import { useStore } from '@store'

/* action */
import { SEARCH_UPDATE } from '@store/search'

/* components */
import { FixedSizeGrid } from 'react-window'
import Search from './search'
import Image from './image'

/* hooks */
import { useHatCheck } from '@hooks/use-check-data'

/* utils */
import { propEq } from 'ramda'

const hatRef = createRef()

const HatTab = () => {
  const [isFirstRender, updateFirstRender] = useState(true)
  const [hats, dispatch] = useStore('hat')
  const { region, version, hat: hatRegion } = useHatCheck()
  const [currentHat] = useStore('meta.character.hat')
  const [searchParam] = useStore('search.hat')
  const [width] = useStore('search.tabWidth')
  const searchedHat = hats.filter(
    ({ name = '', requiredGender }) =>
      name.toUpperCase().indexOf(searchParam.name.toUpperCase()) !== -1
  )
  useEffect(
    () => () => {
      dispatch({
        type: SEARCH_UPDATE,
        payload: {
          type: 'hat',
          field: 'scrollTop',
          value: hatRef?.current?.state?.scrollTop || 0,
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
      const index = searchedHat.findIndex(propEq('id', currentHat.id))
      return index !== -1 ? (Math.floor(index / CLOUMN_COUNT) - 1) * 95 : 0
    }
  }, [searchedHat.length, CLOUMN_COUNT])
  const renderKey = useMemo(() => Math.random().toString(36).slice(2, 7), [
    initHeight,
  ])
  const perWidth = width / CLOUMN_COUNT
  return (
    <div>
      <Search />
      <FixedSizeGrid
        columnCount={CLOUMN_COUNT}
        columnWidth={perWidth}
        rowCount={Math.ceil(searchedHat.length / CLOUMN_COUNT)}
        rowHeight={95}
        width={width}
        height={350}
        itemData={searchedHat}
        initialScrollTop={initHeight}
        key={`hat-${renderKey}-${hatRegion}`}
        ref={hatRef}
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
    </div>
  )
}

export default memo(HatTab)
