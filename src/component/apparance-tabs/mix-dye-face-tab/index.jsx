import { useCallback, useMemo, useEffect } from 'react'

/* api */
import { APIGetFace } from '@api'

/* actions */
import { useStore } from '@store'
import { FACE_INITIAL } from '@store/face'
import { CHANGE_DATA_REGION, UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Row, Col, Card } from 'antd'
import OpacitySlider from './opacity-slider'

/* hooks */
import { useFaceCheck } from '@hooks/use-check-data'

/* utils */
import groupFace, { formatFaceId } from '@utils/group-face'
import { F, includes, keys } from 'ramda'

/* i18n */
import { withTranslation } from '@i18n'

/* mapping */
import FaceColors from '@mapping/face-color'

const MixDyeFace = ({ t }) => {
  const [
    { faceId, faceColorId, mixFaceColorId, mixFaceOpacity },
    dispatch,
  ] = useStore('meta.character')
  const { region, version } = useFaceCheck()
  const [faces] = useStore('face')

  const currentFace = useMemo(
    () =>
      faceId && faces[formatFaceId(faceId)]
        ? faces[formatFaceId(faceId)]
        : { colors: {} },
    [faces, faceId]
  )
  const hasThisColor = useCallback(
    (id) =>
      faceId && currentFace ? includes(id, keys(currentFace.colors)) : false,
    [currentFace, faceId]
  )

  const handleChangeColor = useCallback(
    (field) => ({ target: { value: colorId } }) => {
      const hasColor = currentFace.colors[colorId]
      const payload = {
        ...{ [field]: colorId },
        ...(field === 'faceColorId'
          ? { faceId: hasColor ? hasColor.id : faceId }
          : {}),
      }
      dispatch({
        type: UPDATE_CHARACTER,
        payload,
      })
    },
    [currentFace, faceId]
  )
  const getImageSrc = useCallback(
    (id) =>
      (currentFace &&
        currentFace.colors[id] &&
        `https://maplestory.io/api/${region}/${version}/item/${currentFace.colors[id].id}/icon`) ||
      '',
    [currentFace, region, version]
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
            {FaceColors.map(({ id, color, name }) => (
              <Col span={12} key={`base-${id}`}>
                <input
                  type="radio"
                  name="face-base-select"
                  id={`face-base-select-${id}`}
                  className="select-item-checkbox"
                  value={id}
                  checked={+id === +faceColorId}
                  onChange={
                    hasThisColor(id) ? handleChangeColor('faceColorId') : F
                  }
                />
                <label
                  htmlFor={`face-base-select-${id}`}
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
        <h3 className="mix-text">{t('mix_face_preview')}</h3>
        <div className="mix-preview">
          <img
            className="mix-preview-image"
            src={getImageSrc(faceColorId)}
            alt={currentFace.name}
          />
          <img
            className="mix-preview-image"
            src={getImageSrc(mixFaceColorId) || getImageSrc(faceColorId) || ''}
            alt={currentFace.name}
            style={{ opacity: mixFaceOpacity || 0 }}
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
            {FaceColors.map(({ id, color, name }) => (
              <Col span={12} key={`mix-${id}`}>
                <input
                  type="radio"
                  name="face-mix-select"
                  id={`face-mix-select-${id}`}
                  className="select-item-checkbox"
                  value={id}
                  checked={+id === +mixFaceColorId}
                  onChange={
                    hasThisColor(id) ? handleChangeColor('mixFaceColorId') : F
                  }
                />
                <label
                  htmlFor={`face-mix-select-${id}`}
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

MixDyeFace.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(MixDyeFace)
