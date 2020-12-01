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
import { useFaceCheck } from '@hooks/use-check-data'

/* utils */
import { formatFaceId } from '@utils/group-face'
import { propEq } from 'ramda'

const faceRef = createRef()

const FaceTab = () => {
  const [isFirstRender, updateFirstRender] = useState(true)
  const [faces, dispatch] = useStore('face')
  const { region, version, face: faceRegion } = useFaceCheck()
  const [{ id: faceId, colorId }] = useStore('meta.character.face', '')
  const [searchParam] = useStore('search.face')
  const [width] = useStore('search.tabWidth')
  const facesValues = useMemo(() => Object.values(faces), [faces])
  const searchedFace = facesValues
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
          type: 'face',
          field: 'scrollTop',
          value: faceRef?.current?.state?.scrollTop || 0,
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
      const index = searchedFace.findIndex(
        propEq('id', formatFaceId(faceId) + '')
      )
      return index !== -1 ? (Math.floor(index / CLOUMN_COUNT) - 1) * 95 : 0
    }
  }, [searchedFace.length, colorId, CLOUMN_COUNT])

  const renderKey = useMemo(() => Math.random().toString(36).slice(2, 7), [
    initHeight,
  ])
  const perWidth = width / CLOUMN_COUNT
  return (
    <div>
      <Search />
      <FixedSizeGrid
        columnCount={5}
        columnWidth={perWidth}
        rowCount={Math.ceil(searchedFace.length / CLOUMN_COUNT)}
        rowHeight={95}
        width={width}
        height={300}
        itemData={searchedFace}
        initialScrollTop={initHeight}
        key={`face-${renderKey}-${faceRegion}`}
        ref={faceRef}
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

export default memo(FaceTab)
