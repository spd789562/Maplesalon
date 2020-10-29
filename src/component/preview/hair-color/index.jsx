import { memo, useMemo, useCallback } from 'react'
import { useStore } from '@store'

/* action */
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Table } from 'antd'
import CharacterImage from '@components/character-image'
import ColorDot from '../color-dot'

/* helper */
import { formatHairId } from '@utils/group-hair'
import { clone, map, pipe, assocPath } from 'ramda'

/* mapping */
import HairColor from '@mapping/hair-color'

const generateTableData = (
  currentCharacter,
  currentHair,
  handleChange,
  hairColorId,
  region
) => {
  const columns = map(
    ({ id, color, name }) => ({
      id,
      title: <ColorDot color={color} name={name} />,
      dataIndex: id,
      width: 100,
      align: 'center',
      className: +id === +hairColorId ? 'table-column__active' : '',
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
    HairColor
  ).filter(({ id }) => !!currentHair.colors[id])

  const data = map(
    ({ id }) =>
      pipe(
        clone,
        assocPath(['selectedItems', 'Hair', 'id'], id),
        assocPath(['selectedItems', 'Hair', 'region'], region.region),
        assocPath(['selectedItems', 'Hair', 'version'], region.version)
      )(currentCharacter),
    currentHair.colors
  )
  return {
    columns,
    data,
  }
}

const HairColorPreview = () => {
  const [{ hairColorId, hairId }, dispatch] = useStore('meta.character')
  const [currentCharacter] = useStore('character.current')
  const [region] = useStore('meta.region')
  const [hairs] = useStore('hair')
  const currentHair = useMemo(
    () => (hairId ? hairs[formatHairId(hairId)] : { colors: {} }),
    [hairs, hairId]
  )

  const handleChange = useCallback(
    (hairColorId) => {
      dispatch({
        type: UPDATE_CHARACTER,
        payload: {
          hairColorId,
          mixHairColorId: hairColorId,
          hairId: currentHair.colors[hairColorId].id,
        },
      })
    },
    [currentHair, hairId]
  )

  const tableData = useMemo(
    () =>
      generateTableData(
        currentCharacter,
        currentHair,
        handleChange,
        hairColorId,
        region
      ),
    [currentCharacter, currentHair, hairColorId]
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

export default memo(HairColorPreview)
