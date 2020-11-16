import { memo, useRef, useMemo } from 'react'

import { useStore } from '@store'

/* components */
import { FixedSizeGrid } from 'react-window'
import Image from './image'

/* mapping */
import Skins from '@mapping/skins'

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
          rowCount={Math.ceil(Skins.length / COLUMN_COUNT)}
          rowHeight={105}
          width={width}
          height={300}
          itemData={Skins}
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
