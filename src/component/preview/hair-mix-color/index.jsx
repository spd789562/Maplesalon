import { memo, useMemo, useCallback, useState, Fragment } from 'react'
import { useStore } from '@store'

/* action */
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Table, Switch, Row, Col } from 'antd'
import CharacterImage from '@components/character-image'
import ColorDot from '../color-dot'
import OpacitySlider from '../opacity-slider'

/* hooks */
import useChangedCharacter from '@hooks/use-changed-character'

/* helper */
import { formatHairId, getHairColorId } from '@utils/group-hair'
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
import HairColor from '@mapping/hair-color'

const generateTableData = ({
  changedCharacter,
  currentHair,
  handleChange,
  hairColorId,
  mixHairOpacity,
  isFront,
  region,
}) => {
  const filterdColors = filter(pipe(prop('id'), has(__, currentHair.colors)))(
    HairColor
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
              data.selectedItems.Hair.id,
              data.mixDye.hairColorId,
              data.mixDye.hairOpacity
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
              ['selectedItems', 'Hair', 'id'],
              currentHair.colors[baseId].id
            ),
            assocPath(['selectedItems', 'Hair', 'region'], region.region),
            assocPath(['selectedItems', 'Hair', 'version'], region.version),
            assocPath(['mixDye', 'hairColorId'], id),
            assocPath(['mixDye', 'hairOpacity'], mixHairOpacity),
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

const HairColorPreview = () => {
  const [
    {
      characterChanges: { hairColorId, hairId },
      changedCharacter,
      regionData,
    },
    dispatch,
  ] = useChangedCharacter()
  const [isFront, changePosture] = useState(true)
  const [mixHairOpacity, changeOpacity] = useState(0.5)
  const [hairs] = useStore('hair')
  const currentHair = useMemo(
    () => (hairId ? hairs[formatHairId(hairId)] : { colors: {} }),
    [hairs, hairId]
  )

  const handleChange = useCallback((hairId, mixHairColorId, mixHairOpacity) => {
    dispatch({
      type: UPDATE_CHARACTER,
      payload: {
        hairColorId: getHairColorId(hairId),
        mixHairColorId,
        mixHairOpacity,
        hairId,
      },
    })
  }, [])

  const tableData = useMemo(
    () =>
      generateTableData({
        changedCharacter,
        currentHair,
        mixHairOpacity,
        handleChange,
        hairColorId,
        isFront,
        region: regionData,
      }),
    [changedCharacter, currentHair, hairColorId, isFront, mixHairOpacity]
  )

  return (
    <Fragment>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8} xxl={6}>
          <OpacitySlider mixOpacity={mixHairOpacity} onChange={changeOpacity} />
        </Col>
        <Col xs={24} md={4}>
          <Switch
            checkedChildren={'front'}
            unCheckedChildren={'back'}
            checked={isFront}
            onChange={changePosture}
          />
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

export default memo(HairColorPreview)
