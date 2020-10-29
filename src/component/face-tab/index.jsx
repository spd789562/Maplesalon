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
  const { region, version } = useFaceCheck()
  const [{ faceColorId: colorId, faceId }] = useStore('meta.character', '')
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
  const initHeight = useMemo(() => {
    if (searchParam.scrollTop && isFirstRender) {
      updateFirstRender(false)
      return searchParam.scrollTop
    } else {
      const index = searchedFace.findIndex(
        propEq('id', formatFaceId(faceId) + '')
      )
      return index !== -1 ? (Math.floor(index / 5) - 1) * 95 : 0
    }
  }, [colorId])

  const renderKey = useMemo(() => Math.random().toString(36).slice(2, 7), [
    faceId,
    initHeight,
  ])
  const perWidth = width / 5
  return (
    <div>
      <Search />
      <FixedSizeGrid
        columnCount={5}
        columnWidth={perWidth}
        rowCount={Math.ceil(searchedFace.length / 5)}
        rowHeight={95}
        width={width}
        height={300}
        itemData={searchedFace}
        initialScrollTop={initHeight}
        key={`face-${renderKey}`}
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
