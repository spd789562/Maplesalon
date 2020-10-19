import { useMemo, useState, useEffect, useRef } from 'react'
import { useStore } from '@store'

/* api */
import { APIGetHair } from '@api'

/* action */
import { HAIR_INITIAL } from '@store/hair'

/* components */
import { FixedSizeGrid } from 'react-window'
import ColorSelect from './color-select'
import Search from './search'
import Image from './image'

/* utils */
import groupHair from '@utils/group-hair'

const HairTab = () => {
  const container = useRef(null)
  const [hairs, dispatch] = useStore('hair')
  const [{ region, version }] = useStore('meta.region')
  const [colorId] = useStore('meta.character.hairColorId')
  const hairsValues = useMemo(() => Object.values(hairs), [hairs])
  const [beforeSarchHairs, updateSearchedHair] = useState(hairsValues)
  const [searchParam, updateSearchParam] = useState({
    gender: '',
    name: '',
  })
  useEffect(() => {
    if (region && version)
      APIGetHair({ region, version }).then((data) =>
        dispatch({ type: HAIR_INITIAL, payload: groupHair(data) })
      )
  }, [region, version])
  useEffect(() => {
    updateSearchedHair(
      hairsValues
        .filter(({ colors }) => colors && colors[colorId])
        .filter(
          ({ name, colors: { [colorId]: { requiredGender } = {} } }) =>
            name.indexOf(searchParam.name) !== -1 &&
            (!searchParam.gender || requiredGender === +searchParam.gender)
        )
    )
  }, [hairsValues, searchParam, colorId])
  const width = container?.current?.offsetWidth || 300
  const perWidth = width / 5
  return (
    <div ref={container}>
      <Search searchParam={searchParam} updateSearchParam={updateSearchParam} />
      <FixedSizeGrid
        columnCount={5}
        columnWidth={perWidth}
        rowCount={beforeSarchHairs.length / 5}
        rowHeight={95}
        width={width}
        height={300}
        itemData={beforeSarchHairs}
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

export default HairTab
