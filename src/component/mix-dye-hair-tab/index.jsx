import { useCallback, useMemo } from 'react'

/* actions */
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Row, Col, Card, Slider } from 'antd'

/* utils */
import { debounce } from 'throttle-debounce'
import { formatHairId } from '@utils/group-hair'
import { F, includes, keys } from 'ramda'

/* mapping */
import HairColors from '@mapping/hair-color'

const getMark = (opacity) => {
  const [_, decimalStr] = opacity.toString().split('.')
  const decimal = decimalStr ? +decimalStr.padEnd(2, '0') : 0
  return {
    0: `${100 - decimal}%`,
    100: `${decimal}%`,
  }
}

const MixDyeHair = ({ tabType }) => {
  const [
    { hairId, hairColorId, mixHairColorId, mixHairOpacity },
    dispatch,
  ] = useStore('meta.character')
  const [{ region, version }] = useStore('meta.region')
  const [hairs] = useStore('hair')
  const currentHair = useMemo(
    () => (hairId ? hairs[formatHairId(hairId)] : { colors: {} }),
    [hairs, hairId]
  )
  const hasThisColor = useCallback(
    (id) =>
      hairId && currentHair ? includes(id, keys(currentHair.colors)) : true,
    [currentHair, hairId]
  )

  const handleChangeColor = useCallback(
    (field) => ({ target: { value: colorId } }) => {
      const hasColor = currentHair.colors[colorId]
      const payload = {
        ...{ [field]: colorId },
        ...(field === 'hairColorId'
          ? { hairId: hasColor ? hasColor.id : hairId }
          : {}),
      }
      dispatch({
        type: UPDATE_CHARACTER,
        payload,
      })
    },
    [currentHair, hairId]
  )
  const getImageSrc = useCallback(
    (id) =>
      (currentHair.colors[id] &&
        `https://maplestory.io/api/${region}/${version}/item/${currentHair.colors[id].id}/icon`) ||
      '',
    [currentHair.id, region, version]
  )
  const handleChangeOpacity = useCallback(
    debounce(200, (value) => {
      dispatch({
        type: UPDATE_CHARACTER,
        payload: {
          mixHairOpacity: value / 100,
        },
      })
    }),
    []
  )
  const marks = useMemo(() => getMark(mixHairOpacity), [mixHairOpacity])

  return (
    <Row gutter={[8, 8]}>
      <Col xs={{ span: 12, order: 1 }} sm={{ span: 6, order: 1 }}>
        <Card title={'base_color'} size="small">
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
                  onChange={
                    hasThisColor(id) ? handleChangeColor('hairColorId') : F
                  }
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
        <h3>{'mix_preview'}</h3>
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
        <div className="mix-opacity">
          <Slider
            marks={marks}
            defaultValue={mixHairOpacity * 100}
            onChange={handleChangeOpacity}
            tooltipVisible={false}
            included
          />
        </div>
      </Col>
      <Col xs={{ span: 12, order: 2 }} sm={{ span: 6, order: 3 }}>
        <Card title={'mix_color'} size="small">
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
        .mix-opacity {
          margin-left: auto;
          margin-right: auto;
          width: 80%;
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

export default MixDyeHair
