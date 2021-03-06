import { memo, useMemo, useCallback, useState, Fragment } from 'react'
import { useStore } from '@store'

/* action */
import { UPDATE_CHARACTER } from '@store/meta'
import { APPEND_HISTORY } from '@store/history'

/* components */
import { Table } from 'antd'
import CharacterImage from '@components/character-image'
import FrontBackSwitch from '@components/front-back-switch'
import ColorDot from '../color-dot'

/* hooks */
import useChangedCharacter from '@hooks/use-changed-character'

/* helper */
import { formatHairId, getHairColorId } from '@utils/group-hair'
import { clone, map, pipe, assocPath, assoc } from 'ramda'

/* mapping */
import HairColor from '@mapping/hair-color'

const generateTableData = (
  currentCharacter,
  currentHair,
  handleChange,
  hairColorId,
  isFront,
  region
) => {
  const columns = currentHair
    ? map(
        ({ id, color, name }) => ({
          id,
          title: <ColorDot color={color} name={name} />,
          dataIndex: id,
          key: `hair-${id}`,
          width: 100,
          align: 'center',
          className: +id === +hairColorId ? 'table-column__active' : '',
          render: (data) =>
            data && (
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
    : []

  const data = currentHair
    ? map(
        ({ id }) =>
          pipe(
            clone,
            assocPath(['selectedItems', 'Hair', 'id'], id),
            assocPath(['selectedItems', 'Hair', 'region'], region.region),
            assocPath(['selectedItems', 'Hair', 'version'], region.version),
            assocPath(['mixDye', 'hairColorId'], getHairColorId(id)),
            assoc('action', isFront ? 'stand1' : 'ladder')
          )(currentCharacter),
        currentHair.colors
      )
    : []

  data.key = 'hair'

  return {
    columns,
    data,
  }
}

const HairColorPreview = () => {
  const [
    {
      characterChanges: {
        hair: { id: hairId, colorId: hairColorId },
      },
      changedCharacter,
      regionData,
    },
    dispatch,
  ] = useChangedCharacter()
  const [isFront, changePosture] = useState(true)
  const [hairs] = useStore('hair')
  const currentHair = useMemo(
    () => (hairId ? hairs[formatHairId(hairId)] : { colors: {} }),
    [hairs, hairId]
  )

  const handleChange = useCallback(
    (colorId) => {
      const updateData = {
        id: currentHair.colors[colorId].id,
        colorId,
        region: regionData.region,
        version: regionData.version,
      }
      dispatch({
        type: UPDATE_CHARACTER,
        payload: {
          hair: updateData,
          mixHairColorId: colorId,
        },
      })
      dispatch({
        type: APPEND_HISTORY,
        payload: {
          type: 'hair',
          name: currentHair.name,
          ...updateData,
        },
      })
    },
    [currentHair, hairId, regionData.region, regionData.version]
  )

  const tableData = useMemo(
    () =>
      generateTableData(
        changedCharacter,
        currentHair,
        handleChange,
        hairColorId,
        isFront,
        regionData
      ),
    [changedCharacter, currentHair, hairColorId, isFront]
  )

  return (
    <Fragment>
      <div style={{ paddingBottom: 16 }}>
        <FrontBackSwitch checked={isFront} onChange={changePosture} />
      </div>
      <Table
        dataSource={[tableData.data]}
        columns={tableData.columns}
        scroll={{ x: true }}
        size="middle"
        pagination={false}
      />
    </Fragment>
  )
}

export default memo(HairColorPreview)
