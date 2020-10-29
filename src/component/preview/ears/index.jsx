import { memo, useMemo, useCallback } from 'react'
import { useStore } from '@store'

/* action */
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Table } from 'antd'
import CharacterImage from '@components/character-image'

/* helper */
import { clone, map, pipe, assoc } from 'ramda'

/* mapping */
import Ears from '@mapping/ears'

const generateTableData = (currentCharacter, earsType, handleChange) => {
  const columns = Ears.map(({ id, name }, index) => ({
    id: id,
    title: name,
    dataIndex: index,
    width: 100,
    align: 'center',
    className: +id === +earsType ? 'table-column__active' : '',
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
  }))
  const data = map(
    ({ id }) =>
      pipe(
        clone,
        assoc('mercEars', id === '1'),
        assoc('illiumEars', id === '2'),
        assoc('highFloraEars', id === '3')
      )(currentCharacter),
    Ears
  )
  return {
    columns,
    data,
  }
}

const EarsPreview = () => {
  const [earsType, dispatch] = useStore('meta.character.earsType')
  const [currentCharacter] = useStore('character.current')
  const handleChange = useCallback((earsType) => {
    dispatch({
      type: UPDATE_CHARACTER,
      payload: {
        earsType,
      },
    })
  }, [])

  const tableData = useMemo(
    () => generateTableData(currentCharacter, earsType, handleChange),
    [currentCharacter, earsType]
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

export default memo(EarsPreview)
