import { useMemo, useCallback, memo } from 'react'

/* store */
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'
import { CHARACTER_UPDATE, CHARACTER_CHANGE } from '@store/character'

/* components */
import { Row, Col, Button, Input, Tooltip } from 'antd'
import { ReloadOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons'
import CharacterImage from '@components/character-image'

/* hooks */
import useChangedCharacter from '@hooks/use-changed-character'

/* i18n */
import { withTranslation } from '@i18n'

/* utils */
import getCharacterUpdateData from '@utils/get-character-update-data'

const CharacterDifferent = ({ t }) => {
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
        <Tooltip title={t('edit_character_name')} key={currentCharacter.name}>
          <Input
            placeholder={t('type_character_name')}
            onChange={handleEditName}
            defaultValue={currentCharacter.name}
            key={currentCharacter.name}
            prefix={<UserOutlined />}
          />
        </Tooltip>
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
              <div className="not-change">{t('not_thing_change')}</div>
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
              {t('reset_character')}
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
              {t('save_character')}
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
        .not-change {
          height: 100%;
          color: #999;
          display: flex;
          justify-content: center;
          align-items: center;
          word-break: break-all;
        }
      `}</style>
    </Row>
  )
}

CharacterDifferent.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(CharacterDifferent)
