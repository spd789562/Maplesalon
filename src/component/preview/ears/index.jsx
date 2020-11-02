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
import { clone, map, pipe, assoc } from 'ramda'
import { withTranslation } from '@i18n'

/* mapping */
import Ears from '@mapping/ears'

const generateTableData = (currentCharacter, earsType, handleChange, t) => {
  const columns = Ears.map(({ id, name }, index) => ({
    id: id,
    title: t(name),
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

const EarsPreview = ({ t }) => {
  const [
    { characterChanges, changedCharacter },
    dispatch,
  ] = useChangedCharacter()
  const earsType = characterChanges.earsType
  const handleChange = useCallback((earsType) => {
    dispatch({
      type: UPDATE_CHARACTER,
      payload: {
        earsType,
      },
    })
  }, [])

  const tableData = useMemo(
    () => generateTableData(changedCharacter, earsType, handleChange, t),
    [changedCharacter, earsType]
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

EarsPreview.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default memo(withTranslation('index')(EarsPreview))
