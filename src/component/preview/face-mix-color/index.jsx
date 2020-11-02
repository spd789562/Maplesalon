import { memo, useMemo, useCallback, useState, Fragment } from 'react'
import { useStore } from '@store'

/* action */
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Table, Row, Col } from 'antd'
import CharacterImage from '@components/character-image'
import FrontBackSwitch from '@components/front-back-switch'
import ColorDot from '../color-dot'
import OpacitySlider from '../opacity-slider'

/* hooks */
import useChangedCharacter from '@hooks/use-changed-character'
import { useFaceCheck } from '@hooks/use-check-data'

/* helper */
import { formatFaceId, getFaceColorId } from '@utils/group-face'
import {
  addIndex,
  assoc,
  assocPath,
  clone,
  filter,
  has,
  map,
  pipe,
  prop,
  reduce,
  values,
  __,
} from 'ramda'

/* mapping */
import FaceColor from '@mapping/face-color'

const generateTableData = ({
  changedCharacter,
  currentFace,
  handleChange,
  faceColorId,
  mixFaceOpacity,
  isFront,
  region,
}) => {
  const filterdColors = filter(pipe(prop('id'), has(__, currentFace.colors)))(
    FaceColor
  )
  const columns = map(
    ({ id, color, name }) => ({
      id,
      title: <ColorDot color={color} name={name} />,
      dataIndex: id,
      width: 116,
      align: 'center',
      render: (data) => (
        <div
          className="character-block"
          style={{ display: 'inline-block', width: '100px' }}
          onClick={() => {
            handleChange(
              data.selectedItems.Face.id,
              data.mixDye.faceColorId,
              data.mixDye.faceOpacity
            )
          }}
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
    filterdColors
  )

  const data = pipe(
    map(({ id: baseId, color, name }) =>
      addIndex(reduce)(
        (colors, { id }) => {
          colors[id] = pipe(
            clone,
            assocPath(
              ['selectedItems', 'Face', 'id'],
              currentFace.colors[baseId].id
            ),
            assocPath(['selectedItems', 'Face', 'region'], region.region),
            assocPath(['selectedItems', 'Face', 'version'], region.version),
            assocPath(['mixDye', 'faceColorId'], id),
            assocPath(['mixDye', 'faceOpacity'], mixFaceOpacity),
            assoc('action', isFront ? 'stand1' : 'ladder')
          )(changedCharacter)
          return colors
        },
        {
          'color-dot': { color, name },
        }
      )(filterdColors)
    )
  )(filterdColors)

  return {
    columns: [
      {
        id: 'color-dot',
        title: 'base\\mix',
        dataIndex: 'color-dot',
        align: 'center',
        fixed: true,
        width: 80,
        render: ({ color, name }) => <ColorDot color={color} name={name} />,
      },
      ...columns,
    ],
    data,
  }
}

const FaceColorPreview = () => {
  useFaceCheck()
  const [
    {
      characterChanges: { faceColorId, faceId },
      changedCharacter,
      regionData,
    },
    dispatch,
  ] = useChangedCharacter()
  const [isFront, changePosture] = useState(true)
  const [mixFaceOpacity, changeOpacity] = useState(0.5)
  const [faces] = useStore('face')
  console.log(faces)
  const currentFace = useMemo(
    () => (faceId ? faces[formatFaceId(faceId)] : { colors: {} }),
    [faces, faceId]
  )

  const handleChange = useCallback((faceId, mixFaceColorId, mixFaceOpacity) => {
    dispatch({
      type: UPDATE_CHARACTER,
      payload: {
        faceColorId: getFaceColorId(faceId),
        mixFaceColorId,
        mixFaceOpacity,
        faceId,
      },
    })
  }, [])

  const tableData = useMemo(
    () =>
      generateTableData({
        changedCharacter,
        currentFace,
        mixFaceOpacity,
        handleChange,
        faceColorId,
        isFront,
        region: regionData,
      }),
    [changedCharacter, currentFace, faceColorId, isFront, mixFaceOpacity]
  )

  return (
    <Fragment>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8} xxl={6}>
          <OpacitySlider mixOpacity={mixFaceOpacity} onChange={changeOpacity} />
        </Col>
        <Col xs={24} md={4}>
          <FrontBackSwitch checked={isFront} onChange={changePosture} />
        </Col>
      </Row>
      <Table
        dataSource={tableData.data}
        columns={tableData.columns}
        scroll={{ x: '100%' }}
        size="middle"
        pagination={false}
        sticky
      />
    </Fragment>
  )
}

export default memo(FaceColorPreview)
