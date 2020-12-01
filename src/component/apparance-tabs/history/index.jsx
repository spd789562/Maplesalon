import { memo, useMemo, useState, useEffect, createRef } from 'react'
import { useStore } from '@store'

/* components */
import { FixedSizeGrid } from 'react-window'
import Image from './image'

/* utils */
import { debounce } from 'throttle-debounce'

const historyHeight = createRef()

const HatTab = () => {
  const [initHeight, setInitHeight] = useState(100)
  const [history] = useStore('history')
  const [width] = useStore('search.tabWidth')
  const CLOUMN_COUNT = width < 400 ? 4 : 5

  const updateHeight = useCallback(
    debounce(200, () => {
      if (historyHeight.current)
        setInitHeight(historyHeight.current.offsetHeight)
    }),
    [historyHeight.current]
  )
  useEffect(() => {
    window.addEventListener('resize', updateHeight)
    updateHeight()
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const renderKey = useMemo(() => Math.random().toString(36).slice(2, 7), [
    initHeight,
  ])
  const perWidth = width / CLOUMN_COUNT
  return (
    <div ref={historyHeight}>
      <FixedSizeGrid
        columnCount={CLOUMN_COUNT}
        columnWidth={perWidth}
        rowCount={Math.ceil(searchedHat.length / CLOUMN_COUNT)}
        rowHeight={95}
        width={width}
        height={initHeight}
        itemData={history}
        key={`hat-${renderKey}`}
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
