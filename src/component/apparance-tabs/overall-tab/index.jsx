import { memo, useMemo, useState, useEffect, createRef } from 'react'
import { useStore } from '@store'

/* action */
import { SEARCH_UPDATE } from '@store/search'

/* components */
import { FixedSizeGrid } from 'react-window'
import Search from './search'
import Image from './image'

/* hooks */
import { useOverallCheck } from '@hooks/use-check-data'

/* utils */
import { propEq } from 'ramda'

const overallRef = createRef()

const OverallTab = () => {
  const [isFirstRender, updateFirstRender] = useState(true)
  const [overalls, dispatch] = useStore('overall')
  const { region, version } = useOverallCheck()
  const [currentOverall] = useStore('meta.character.overall')
  const [searchParam] = useStore('search.overall')
  const [width] = useStore('search.tabWidth')
  const searchedOverall = overalls.filter(
    ({ name = '', requiredGender }) =>
      name.toUpperCase().indexOf(searchParam.name.toUpperCase()) !== -1
  )
  useEffect(
    () => () => {
      dispatch({
        type: SEARCH_UPDATE,
        payload: {
          type: 'overall',
          field: 'scrollTop',
          value: overallRef?.current?.state?.scrollTop || 0,
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
      const index = searchedOverall.findIndex(propEq('id', currentOverall.id))
      return index !== -1 ? (Math.floor(index / CLOUMN_COUNT) - 1) * 95 : 0
    }
  }, [searchedOverall.length, CLOUMN_COUNT])
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
        rowCount={Math.ceil(searchedOverall.length / CLOUMN_COUNT)}
        rowHeight={95}
        width={width}
        height={350}
        itemData={searchedOverall}
        initialScrollTop={initHeight}
        key={`overall-${renderKey}`}
        ref={overallRef}
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

export default memo(OverallTab)
