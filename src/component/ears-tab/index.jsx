import { memo, useRef, useMemo } from 'react'

import { useStore } from '@store'

/* components */
import { FixedSizeGrid } from 'react-window'
import Image from './image'

/* mapping */
import Ears from '@mapping/ears'

const COLUMN_COUNT = 4

const FaceTab = () => {
  const container = useRef(null)
  const [width] = useStore('search.tabWidth')
  const perWidth = width / COLUMN_COUNT
  return useMemo(
    () => (
      <div ref={container}>
        <FixedSizeGrid
          columnCount={COLUMN_COUNT}
          columnWidth={perWidth}
          rowCount={Math.ceil(Ears.length / COLUMN_COUNT)}
          rowHeight={105}
          width={width}
          height={300}
          itemData={Ears}
          key={width}
        >
          {Image}
        </FixedSizeGrid>
      </div>
    ),
    [width]
  )
}

export default memo(FaceTab)
