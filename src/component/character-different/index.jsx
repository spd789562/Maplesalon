import { useMemo, useState, useCallback, Fragment } from 'react'

/* store */
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'
import { CHARACTER_UPDATE, CHARACTER_CHANGE } from '@store/character'

/* components */
import { Row, Col, Button, Input, Tooltip, Switch, Select } from 'antd'
import { ReloadOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons'
import CharacterImage from '@components/character-image'

/* hooks */
import useChangedCharacter from '@hooks/use-changed-character'

/* i18n */
import { withTranslation } from '@i18n'

/* utils */
import getCharacterUpdateData from '@utils/get-character-update-data'

/* mapping */
import Actions from '@mapping/actions'
import { mergeRight } from 'ramda'

const isClient = typeof window !== 'undefined'

const CharacterDifferent = ({ t }) => {
  const [
    { currentCharacter, changedCharacter },
    dispatch,
  ] = useChangedCharacter()
  const [property, updateProperty] = useState({
    action: 'stand1',
    animating: false,
  })
  const handleChangeProperty = (filed) => (value) =>
    updateProperty((state) => ({ ...state, [filed]: value }))
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
  const _currentCharacter = mergeRight(currentCharacter, property)
  const _changedCharacter = mergeRight(changedCharacter, property)
  return (
    <Fragment>
      <Row gutter={[8, 8]}>
        <Col xs={24} md={12} xl={15}>
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
        <Col xs={12} md={6} xl={5}>
          <Select
            style={{ width: '100%' }}
            onChange={handleChangeProperty('action')}
            defaultValue={property.action}
          >
            {Actions.map(({ type, text }) => (
              <Select.Option value={type}>{t(text)}</Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={12} md={6} xl={4}>
          {t('character_animation')}：
          <Switch onChange={handleChangeProperty('animating')} />
        </Col>
      </Row>
      <Row style={{ maxWidth: 620, margin: '0 auto' }}>
        <Col span={24}>
          <Row>
            <Col flex="1 0 0">
              <CharacterImage
                characterData={_currentCharacter}
                resize={0.6}
                square={isClient && window.innerWidth > 500}
              />
            </Col>
            <Col className="character-display">
              <div className="changearrow">&gt;</div>
            </Col>
            <Col flex="1 0 0">
              {changedCharacter.isChange ? (
                <CharacterImage
                  characterData={_changedCharacter}
                  resize={0.6}
                  square={isClient && window.innerWidth > 500}
                />
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
            <Col className="character-display"></Col>
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
        <style jsx global>{`
          .character-display {
            flex-basis: 80px;
          }
          @media screen and (max-width: 576px) {
            .character-display {
              flex-basis: 5px;
            }
          }
        `}</style>
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
    </Fragment>
  )
}

CharacterDifferent.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(CharacterDifferent)
