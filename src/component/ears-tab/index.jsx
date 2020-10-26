import { memo, useState, useEffect, useRef } from 'react'

/* components */
import { FixedSizeGrid } from 'react-window'
import Image from './image'

/* mapping */
import Ears from '@mapping/ears'

const FaceTab = () => {
  const container = useRef(null)
  const [gridWidth, updateWidth] = useState(300)
  useEffect(() => {
    if (container?.current) {
      updateWidth(container.current.offsetWidth)
    }
  }, [container])
  const perWidth = gridWidth / 4
  return (
    <div ref={container}>
      <FixedSizeGrid
        columnCount={4}
        columnWidth={perWidth}
        rowCount={Math.ceil(Ears.length / 4)}
        rowHeight={105}
        width={gridWidth}
        height={300}
        itemData={Ears}
        key={gridWidth}
      >
        {Image}
      </FixedSizeGrid>
    </div>
  )
}

export default memo(FaceTab)
