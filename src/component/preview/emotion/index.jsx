import { memo, useMemo, useCallback } from 'react'

/* components */
import { Table } from 'antd'
import CharacterImage from '@components/character-image'

/* hooks */
import useChangedCharacter from '@hooks/use-changed-character'

/* helper */
import { clone, map, pipe, assoc } from 'ramda'

/* mapping */
import Emotions from '@mapping/emotions'

const generateTableData = (currentCharacter) => {
  const columns = Emotions.map(({ text, type }, index) => ({
    id: type,
    title: (
      <img src={`/emotions/${type}.png`} alt={text} style={{ width: 32 }} />
    ),
    dataIndex: index,
    width: 100,
    align: 'center',
    render: (data) => (
      <div style={{ display: 'inline-block', width: '100px' }}>
        <CharacterImage characterData={data} />
      </div>
    ),
  }))
  const data = map(
    ({ type }) => pipe(clone, assoc('emotion', type))(currentCharacter),
    Emotions
  )
  return {
    columns,
    data,
  }
}

const EmotionPreview = () => {
  const [{ changedCharacter }] = useChangedCharacter()

  const tableData = useMemo(() => generateTableData(changedCharacter), [
    changedCharacter,
  ])

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

export default memo(EmotionPreview)
