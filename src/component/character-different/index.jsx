import { useMemo, useCallback, memo } from 'react'

/* store */
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'
import { CHARACTER_UPDATE, CHARACTER_CHANGE } from '@store/character'

/* components */
import { Row, Col, Button, Input } from 'antd'
import { ReloadOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons'
import CharacterImage from '@components/character-image'

/* hooks */
import useChangedCharacter from '@hooks/use-changed-character'

/* utils */
import getCharacterUpdateData from '@utils/get-character-update-data'

const CharacterDifferent = () => {
  const [
    { currentCharacter, changedCharacter },
    dispatch,
  ] = useChangedCharacter()
  const handleEditName = ({ target: { value } }) => {
    dispatch({
      type: UPDATE_CHARACTER,
      payload: {
        name: value,
      },
    })
  }
  const handleReset = useCallback(() => {
    dispatch({
      type: UPDATE_CHARACTER,
      payload: getCharacterUpdateData(currentCharacter),
    })
  }, [currentCharacter])
  const handleSave = useCallback(() => {
    dispatch({ type: CHARACTER_UPDATE, payload: changedCharacter })
    dispatch({ type: CHARACTER_CHANGE, payload: changedCharacter.id })
  }, [changedCharacter])
  return (
    <Row style={{ maxWidth: 500, margin: '0 auto' }}>
      <Col span={24}>
        <Input
          placeholder={'edit_character_name'}
          onChange={handleEditName}
          defaultValue={currentCharacter.name}
          key={currentCharacter.name}
          prefix={<UserOutlined />}
        />
      </Col>
      <Col span={24}>
        <Row>
          <Col flex="1 0 0">
            <CharacterImage characterData={currentCharacter} />
          </Col>
          <Col flex="80px">
            <div className="changearrow">&gt;</div>
          </Col>
          <Col flex="1 0 0">
            {changedCharacter.isChange ? (
              <CharacterImage characterData={changedCharacter} />
            ) : (
              <div>not_thing_change</div>
            )}
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row>
          <Col flex="1 0 0">
            <Button
              type="default"
              size="large"
              icon={<ReloadOutlined />}
              disabled={!changedCharacter.isChange}
              onClick={handleReset}
              block
            >
              Reset
            </Button>
          </Col>
          <Col flex="80px"></Col>
          <Col flex="1 0 0">
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              disabled={!changedCharacter.isChange}
              onClick={handleSave}
              block
            >
              Save
            </Button>
          </Col>
        </Row>
      </Col>
      <style jsx>{`
        .changearrow {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      `}</style>
    </Row>
  )
}

export default CharacterDifferent
