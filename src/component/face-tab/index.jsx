import { memo, useMemo, useState, useEffect, createRef } from 'react'
import { useStore } from '@store'

/* api */
import { APIGetFace } from '@api'

/* action */
import { FACE_INITIAL } from '@store/face'
import { SEARCH_UPDATE } from '@store/search'
import { CHANGE_DATA_REGION } from '@store/meta'

/* components */
import { FixedSizeGrid } from 'react-window'
import ColorSelect from './color-select'
import Search from './search'
import Image from './image'

/* utils */
import groupFace, { formatFaceId } from '@utils/group-face'
import { propEq } from 'ramda'

const faceRef = createRef()

const FaceTab = () => {
  const [faces, dispatch] = useStore('face')
  const [{ region, version, face: faceRegion }] = useStore('meta.region')
  const [{ faceColorId: colorId, faceId }] = useStore('meta.character', '')
  const [searchParam] = useStore('search.face')
  const [width] = useStore('search.tabWidth')
  const facesValues = useMemo(() => Object.values(faces), [faces])
  const [beforeSarchFaces, updateSearchedFace] = useState(facesValues)
  useEffect(() => {
    if (region && version && region !== faceRegion)
      APIGetFace({ region, version }).then((data) => {
        dispatch({ type: FACE_INITIAL, payload: groupFace(data) })
        dispatch({
          type: CHANGE_DATA_REGION,
          payload: {
            field: 'face',
            region,
          },
        })
      })
  }, [region, version])
  useEffect(() => {
    updateSearchedFace(
      facesValues
        .filter(({ colors }) => colors && colors[colorId])
        .filter(
          ({ name, colors: { [colorId]: { requiredGender } = {} } }) =>
            name.indexOf(searchParam.name) !== -1 &&
            (!searchParam.gender || requiredGender === +searchParam.gender)
        )
    )
  }, [facesValues, searchParam, colorId])
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
    if (searchParam.scrollTop) {
      return searchParam.scrollTop
    } else {
      const index = beforeSarchFaces.findIndex(
        propEq('id', formatFaceId(faceId) + '')
      )
      return index !== -1 ? (Math.floor(index / 5) - 1) * 95 : 0
    }
  }, [beforeSarchFaces, faceId])
  const perWidth = width / 5
  return (
    <div>
      <Search />
      <FixedSizeGrid
        columnCount={5}
        columnWidth={perWidth}
        rowCount={Math.ceil(beforeSarchFaces.length / 5)}
        rowHeight={95}
        width={width}
        height={300}
        itemData={beforeSarchFaces}
        initialScrollTop={initHeight}
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
