import { memo, useMemo, useState, useEffect, useRef } from 'react'
import { useStore } from '@store'

/* api */
import { APIGetFace } from '@api'

/* action */
import { FACE_INITIAL } from '@store/face'

/* components */
import { FixedSizeGrid } from 'react-window'
import ColorSelect from './color-select'
import Search from './search'
import Image from './image'

/* utils */
import groupFace from '@utils/group-face'

const FaceTab = () => {
  const container = useRef(null)
  const [faces, dispatch] = useStore('face')
  const [{ region, version }] = useStore('meta.region')
  const [colorId] = useStore('meta.character.faceColorId', '')
  const facesValues = useMemo(() => Object.values(faces), [faces])
  const [beforeSarchFaces, updateSearchedFace] = useState(facesValues)
  const [searchParam, updateSearchParam] = useState({
    gender: '',
    name: '',
  })
  console.log(faces)
  useEffect(() => {
    if (region && version)
      APIGetFace({ region, version }).then((data) =>
        dispatch({ type: FACE_INITIAL, payload: groupFace(data) })
      )
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
  const width = container?.current?.offsetWidth || 300
  const perWidth = width / 5
  return (
    <div ref={container}>
      <Search searchParam={searchParam} updateSearchParam={updateSearchParam} />
      <FixedSizeGrid
        columnCount={5}
        columnWidth={perWidth}
        rowCount={Math.ceil(beforeSarchFaces.length / 5)}
        rowHeight={95}
        width={width}
        height={300}
        itemData={beforeSarchFaces}
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
