import { memo, useMemo, useCallback } from 'react'
import { useStore } from '@store'

/* action */
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Table } from 'antd'
import CharacterImage from '@components/character-image'
import ColorDot from '../color-dot'

/* hooks */
import { useFaceCheck } from '@hooks/use-check-data'

/* helper */
import { formatFaceId } from '@utils/group-face'
import { clone, map, pipe, assocPath } from 'ramda'

/* mapping */
import FaceColor from '@mapping/face-color'

const generateTableData = (
  currentCharacter,
  currentFace,
  handleChange,
  faceColorId,
  region
) => {
  const columns = map(
    ({ id, color, name }) => ({
      id,
      title: <ColorDot color={color} name={name} />,
      dataIndex: id,
      width: 100,
      align: 'center',
      className: +id === +faceColorId ? 'table-column__active' : '',
      render: (data) => (
        <div
          className="character-block"
          style={{ display: 'inline-block', width: '100px' }}
          onClick={() => handleChange(id)}
        >
          <CharacterImage characterData={data} />
          <style jsx>{`
            .character-block {
              cursor: pointer;
            }
          `}</style>
        </div>
      ),
    }),
    FaceColor
  ).filter(({ id }) => !!currentFace.colors[id])

  const data = map(
    ({ id }) =>
      pipe(
        clone,
        assocPath(['selectedItems', 'Face', 'id'], id),
        assocPath(['selectedItems', 'Face', 'region'], region.region),
        assocPath(['selectedItems', 'Face', 'version'], region.version)
      )(currentCharacter),
    currentFace.colors
  )
  return {
    columns,
    data,
  }
}

const FaceColorPreview = () => {
  const [{ faceColorId, faceId }, dispatch] = useStore('meta.character')
  const region = useFaceCheck()
  const [currentCharacter] = useStore('character.current')
  const [faces] = useStore('face')
  const currentFace = useMemo(
    () =>
      faces[2000] && faceId ? faces[formatFaceId(faceId)] : { colors: {} },
    [faces, faceId]
  )

  const handleChange = useCallback(
    (faceColorId) => {
      dispatch({
        type: UPDATE_CHARACTER,
        payload: {
          faceColorId,
          mixFaceColorId: faceColorId,
          faceId: currentFace.colors[faceColorId].id,
        },
      })
    },
    [currentFace, faceId]
  )

  const tableData = useMemo(
    () =>
      generateTableData(
        currentCharacter,
        currentFace,
        handleChange,
        faceColorId,
        region
      ),
    [currentCharacter, currentFace, faceColorId]
  )

  return (
    <Table
      dataSource={[tableData.data]}
      columns={tableData.columns}
      scroll={{ x: true }}
      size="middle"
      pagination={false}
    />
  )
}

export default memo(FaceColorPreview)
