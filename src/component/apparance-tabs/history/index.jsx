import { memo, useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { useStore } from '@store'
import { INITIAL_HISTORY } from '@store/history'

/* components */
import { FixedSizeGrid } from 'react-window'
import Image from './image'

/* utils */
import { debounce } from 'throttle-debounce'

const HatTab = () => {
  const containerRef = useRef(null)
  const [initHeight, setInitHeight] = useState(100)
  const [history, dispatch] = useStore('history')
  const [width] = useStore('search.tabWidth')
  const CLOUMN_COUNT = width < 400 ? 4 : 5

  const updateHeight = useCallback(() => {
    if (containerRef.current) {
      setInitHeight(containerRef.current.offsetHeight)
    }
  }, [containerRef.current])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageHistory =
        localStorage.getItem('MAPLESALON_history') &&
        JSON.parse(localStorage.getItem('MAPLESALON_history'))
      dispatch({
        type: INITIAL_HISTORY,
        payload: storageHistory || [],
      })
      containerRef.current.addEventListener('resize', updateHeight)
      updateHeight()
    }
    return () =>
      containerRef.current &&
      containerRef.current.removeEventListener('resize', updateHeight)
  }, [])

  const renderKey = useMemo(() => Math.random().toString(36).slice(2, 7), [
    initHeight,
  ])
  containerRef.current && console.log(containerRef.current.offsetHeight)

  const perWidth = width / CLOUMN_COUNT
  return (
    <div ref={containerRef} style={{ height: '100%' }}>
      <FixedSizeGrid
        columnCount={CLOUMN_COUNT}
        columnWidth={perWidth}
        rowCount={Math.ceil(history.length / CLOUMN_COUNT)}
        rowHeight={95}
        width={width}
        height={
          containerRef.current ? containerRef.current.offsetHeight : initHeight
        }
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
