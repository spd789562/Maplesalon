import React, { useMemo, useState, useEffect, memo, Fragment } from 'react'
import { useRouter } from 'next/router'

/* component */
import { Row, Col, Card, Switch, Select, Tooltip } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import CharacterImage from '@components/character-image'
import Scale from '@components/character-different/scale'

/* mapping */
import Actions from '@mapping/actions'
import Skins from '@mapping/skins'
import LanguageToRegion from '@mapping/language-to-region'

/* helper */
import { withTranslation } from '@i18n'
import {
  changeHairColorId,
  colorRemover as removeHairColor,
} from '@utils/group-hair'
import {
  changeFaceColorId,
  colorRemover as removeFaceColor,
} from '@utils/group-face'
import { mergeRight, propEq, assoc } from 'ramda'

const isClient = typeof window !== 'undefined'

const useItemName = ({ region = 'GMS', version = '217', id }) => {
  const [name, updateName] = useState('')
  useEffect(() => {
    if (id) {
      fetch(`https://maplestory.io/api/${region}/${version}/item/${id}`)
        .then((e) => e.json())
        .then((data) => updateName(data.description.name))
    }
  }, [])
  return name
}

const getItemIconURL = ({ region = 'GMS', version = '217', id }) =>
  `https://maplestory.io/api/${region}/${version}/item/${id}/icon`

const useMixItem = (item, mixColor) => {
  const normal = item.id ? getItemIconURL(item) : ''
  const mix =
    item.id !== mixColor ? getItemIconURL(assoc('id', mixColor, item)) : ''
  return [normal, mix]
}

function Share({ t, i18n: { language } }) {
  const router = useRouter()
  const characterData = mergeRight(
    { selectedItems: { Hair: {}, Face: {} } },
    JSON.parse(decodeURIComponent(router.query.character))
  )
  const name = characterData.name || ''
  const [property, updateProperty] = useState({
    action: 'stand1',
    animating: false,
    scale: 'full',
  })
  const handleChangeProperty = (filed) => (value) =>
    updateProperty((state) => ({ ...state, [filed]: value }))
  const _character = mergeRight(characterData, property)
  const resize =
    property.scale === 'full'
      ? isClient && window.innerWidth > 500
        ? 0.6
        : 0.9
      : property.scale
  const hairName = useItemName(characterData.selectedItems.Hair)
  const faceName = useItemName(characterData.selectedItems.Face)
  const hairId = characterData.selectedItems.Hair.id
  const [hairIcon, mixHairIcon] = useMixItem(
    characterData.selectedItems.Hair,
    characterData.mixDye?.hairColorId
      ? changeHairColorId(hairId, characterData.mixDye.hairColorId)
      : hairId
  )
  const faceId = characterData.selectedItems.Face.id
  const [faceIcon, mixFaceIcon] = useMixItem(
    characterData.selectedItems.Face,
    characterData.mixDye?.faceColorId
      ? changeFaceColorId(faceId, characterData.mixDye.faceColorId)
      : faceId
  )
  const handleSaveCharacter = () => {
    const characterList =
      (localStorage.getItem('MAPLESALON_characters') &&
        JSON.parse(localStorage.getItem('MAPLESALON_characters'))) ||
      []
    characterList.push({ ...characterData, id: new Date().getTime() })
    localStorage.setItem('MAPLESALON_characters', JSON.stringify(characterList))
  }

  const skin = Skins.find(propEq('id', +characterData.skin))
  const skinIcon = `https://maplestory.io/api/${skin.region}/${skin.version}/character/${skin.id}`
  const skinName = t(skin.name)

  return useMemo(
    () => (
      <div style={{ maxWidth: '500px', padding: 8, margin: '0 auto' }}>
        <Card
          title={name}
          extra={
            <Tooltip
              title={t('save_to_my_list')}
              placement="topRight"
              arrowPointAtCenter
            >
              <SaveOutlined
                onClick={handleSaveCharacter}
                style={{ fontSize: 24 }}
              />
            </Tooltip>
          }
        >
          <Row>
            <Col flex="1">
              <Row gutter={[8, 8]}>
                <Col span={12}>
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
                <Col span={12}>
                  {t('character_animation')}：
                  <Switch onChange={handleChangeProperty('animating')} />
                </Col>
              </Row>
              <CharacterImage
                characterData={_character}
                resize={resize}
                square
              />
              <Scale onChange={handleChangeProperty('scale')} />
            </Col>
            <div className="selected-items">
              {hairIcon && (
                <figure className="item">
                  <div className="item-icon">
                    <img src={hairIcon} />
                    {mixHairIcon && (
                      <img
                        src={mixHairIcon}
                        style={{ opacity: characterData.mixDye.hairOpacity }}
                      />
                    )}
                  </div>
                  <figcaption className="item-name">
                    {removeHairColor(hairName)}
                  </figcaption>
                </figure>
              )}
              {faceIcon && (
                <figure className="item">
                  <div className="item-icon">
                    <img src={faceIcon} />
                    {mixFaceIcon && (
                      <img
                        src={mixFaceIcon}
                        style={{ opacity: characterData.mixDye.faceOpacity }}
                      />
                    )}
                  </div>
                  <figcaption className="item-name">
                    {removeFaceColor(faceName)}
                  </figcaption>
                </figure>
              )}
              <figure className="item">
                <div className="item-icon" style={{ height: 90 }}>
                  <img src={skinIcon} />
                </div>
                <figcaption className="item-name">{skinName}</figcaption>
              </figure>
            </div>
          </Row>
        </Card>
        <style jsx>{`
          .selected-items {
            width: 100%;
          }
          @media screen and (min-width: 400px) {
            .selected-items {
              width: 100px;
            }
          }
          .item {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            width: 100%;
            text-align: center;
            margin-bottom: 8px;
          }
          .item-icon {
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
          .item-icon > img {
            max-height: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .item-name {
            padding-left: 8px;
            padding-right: 8px;
          }
        `}</style>
      </div>
    ),
    [property, hairName, faceName]
  )
}

Share.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(memo(Share))
