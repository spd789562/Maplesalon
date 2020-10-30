import { memo, useMemo, useCallback } from 'react'
import { useStore } from '@store'

/* action */
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Table } from 'antd'
import CharacterImage from '@components/character-image'

/* hooks */
import useChangedCharacter from '@hooks/use-changed-character'

/* helper */
import { clone, map, pipe, assocPath, assoc } from 'ramda'

/* mapping */
import Skins from '@mapping/skins'

const generateTableData = (currentCharacter, skinId, handleChange) => {
  const columns = Skins.map((skin, index) => ({
    id: skin.id,
    title: skin.name,
    dataIndex: index,
    width: 100,
    align: 'center',
    className: +skin.id === +skinId ? 'table-column__active' : '',
    render: (data) => (
      <div
        className="character-block"
        style={{ display: 'inline-block', width: '100px' }}
        onClick={() => handleChange(skin)}
      >
        <CharacterImage characterData={data} />
        <style jsx>{`
          .character-block {
            cursor: pointer;
          }
        `}</style>
      </div>
    ),
  }))

  const data = map(
    ({ id, region, version }) =>
      pipe(
        clone,
        assoc('skin', id),
        assocPath(['selectedItems', 'Head', 'id'], id),
        assocPath(['selectedItems', 'Body', 'id'], 10000 + id),
        assocPath(['selectedItems', 'Head', 'region'], region),
        assocPath(['selectedItems', 'Head', 'version'], version),
        assocPath(['selectedItems', 'Body', 'region'], region),
        assocPath(['selectedItems', 'Body', 'version'], version)
      )(currentCharacter),
    Skins
  )
  return {
    columns,
    data,
  }
}

const SkinPreview = () => {
  const [
    { characterChanges, changedCharacter },
    dispatch,
  ] = useChangedCharacter()
  const skinId = characterChanges.skin.id
  const handleChange = useCallback((skin) => {
    dispatch({
      type: UPDATE_CHARACTER,
      payload: {
        skin,
      },
    })
  }, [])

  const tableData = useMemo(
    () => generateTableData(changedCharacter, skinId, handleChange),
    [changedCharacter, skinId]
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

export default memo(SkinPreview)
