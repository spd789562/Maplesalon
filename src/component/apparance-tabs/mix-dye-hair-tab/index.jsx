import { useCallback, useMemo } from 'react'

/* actions */
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Row, Col, Card } from 'antd'
import OpacitySlider from './opacity-slider'

/* utils */
import { formatHairId } from '@utils/group-hair'
import { F, includes, keys, isEmpty } from 'ramda'

/* i18n */
import { withTranslation } from '@i18n'

/* mapping */
import HairColors from '@mapping/hair-color'

const MixDyeHair = ({ tabType, t }) => {
  const [
    {
      hair: { id: hairId, colorId: hairColorId },
      mixHairColorId,
      mixHairOpacity,
    },
    dispatch,
  ] = useStore('meta.character')
  const [{ region, version }] = useStore('meta.region')
  const [hairs] = useStore('hair')
  const currentHair = useMemo(
    () =>
      !isEmpty(hairs) && hairId ? hairs[formatHairId(hairId)] : { colors: {} },
    [hairs, hairId]
  )
  const hasThisColor = useCallback(
    (id) =>
      hairId && currentHair ? includes(id, keys(currentHair.colors)) : false,
    [currentHair, hairId]
  )

  const handleChangeColor = useCallback(
    (field) => ({ target: { value: colorId } }) => {
      const hasColor = currentHair.colors[colorId]
      const payload =
        field === 'hair'
          ? {
              hair: {
                id: hasColor ? hasColor.id : hairId,
                colorId,
                region,
                version,
              },
            }
          : {
              [field]: colorId,
            }
      dispatch({
        type: UPDATE_CHARACTER,
        payload,
      })
    },
    [currentHair, hairId, region, version]
  )
  const getImageSrc = useCallback(
    (id) =>
      (currentHair.colors[id] &&
        `https://maplestory.io/api/${region}/${version}/item/${currentHair.colors[id].id}/icon`) ||
      '',
    [currentHair.id, region, version]
  )

  return (
    <Row gutter={[8, 8]}>
      <Col xs={{ span: 12, order: 1 }} sm={{ span: 6, order: 1 }}>
        <Card
          title={t('base_color')}
          size="small"
          headStyle={{ textAlign: 'center' }}
        >
          <Row gutter={[6, 6]}>
            {HairColors.map(({ id, color, name }) => (
              <Col span={12} key={`base-${id}`}>
                <input
                  type="radio"
                  name="hair-base-select"
                  id={`hair-base-select-${id}`}
                  className="select-item-checkbox"
                  value={id}
                  checked={+id === +hairColorId}
                  onChange={hasThisColor(id) ? handleChangeColor('hair') : F}
                />
                <label
                  htmlFor={`hair-base-select-${id}`}
                  className={`select-item-block ${
                    hasThisColor(id) ? '' : 'select-item-block__none'
                  }`}
                  title={name}
                  style={{ backgroundColor: color }}
                />
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
      <Col xs={{ span: 24, order: 3 }} sm={{ span: 12, order: 2 }}>
        <h3 className="mix-text">{t('mix_hair_preview')}</h3>
        <div className="mix-preview">
          <img
            className="mix-preview-image"
            src={getImageSrc(hairColorId)}
            alt={currentHair.name}
          />
          <img
            className="mix-preview-image"
            src={getImageSrc(mixHairColorId) || getImageSrc(hairColorId) || ''}
            alt={currentHair.name}
            style={{ opacity: mixHairOpacity || 0 }}
          />
        </div>
        <OpacitySlider />
      </Col>
      <Col xs={{ span: 12, order: 2 }} sm={{ span: 6, order: 3 }}>
        <Card
          title={t('mix_color')}
          size="small"
          headStyle={{ textAlign: 'center' }}
        >
          <Row gutter={[6, 6]}>
            {HairColors.map(({ id, color, name }) => (
              <Col span={12} key={`mix-${id}`}>
                <input
                  type="radio"
                  name="hair-mix-select"
                  id={`hair-mix-select-${id}`}
                  className="select-item-checkbox"
                  value={id}
                  checked={+id === +mixHairColorId}
                  onChange={
                    hasThisColor(id) ? handleChangeColor('mixHairColorId') : F
                  }
                />
                <label
                  htmlFor={`hair-mix-select-${id}`}
                  className={`select-item-block ${
                    hasThisColor(id) ? '' : 'select-item-block__none'
                  }`}
                  title={name}
                  style={{ backgroundColor: color }}
                />
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
      <style jsx>{`
        .mix-text {
          text-align: center;
        }
        .mix-preview {
          position: relative;
          margin-left: auto;
          margin-right: auto;
          width: 60px;
          height: 80px;
          margin-top: 50px;
        }
        .mix-preview-image {
          position: absolute;
          width: 100%;
        }
        .select-item-block {
          width: 100%;
          padding-bottom: 100%;
        }
        .select-item-checkbox {
          display: none;
        }
        .select-item-checkbox:checked + .select-item-block:before {
          border-bottom-color: #fff;
          border-right-color: #fff;
        }
        .select-item-block {
          display: block;
          width: 100%;
          padding-bottom: 100%;
          position: relative;
        }
        .select-item-block:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 53%;
          transform: translate(-60%, -60%) rotate(45deg);
          width: 30%;
          height: 50%;
          border: 2px solid transparent;
        }
        .select-item-block__none {
          filter: contrast(0.5);
          cursor: not-allowed;
        }
      `}</style>
    </Row>
  )
}

MixDyeHair.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(MixDyeHair)
