import { useState, useCallback, Fragment } from 'react'

/* store */
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Popover, Checkbox } from 'antd'

/* i18n */
import { withTranslation } from '@i18n'

/* hooks */
import { useHairCheck, useFaceCheck } from '@hooks/use-check-data'

/* utils */
import { F, evolve, isEmpty, prop, includes, pipe, values } from 'ramda'
import { getHairColorId } from '@utils/group-hair'
import { getFaceColorId } from '@utils/group-face'

/* mappings */
import Skins from '@mapping/skins'
import Ears from '@mapping/ears'

const options = [
  { label: 'random_hair', value: 'hair' },
  { label: 'random_face', value: 'face' },
  { label: 'random_skin', value: 'skin' },
  { label: 'random_ears', value: 'ears' },
]

const optionValues = options.map(prop('value'))

const StyleOptions = withTranslation('index')(({ t, onChange }) => (
  <Checkbox.Group defaultValue={optionValues} onChange={onChange}>
    {options.map(evolve({ label: t })).map(({ label, value }) => (
      <div key={`random-${value}`}>
        <Checkbox value={value}>{label}</Checkbox>
      </div>
    ))}
  </Checkbox.Group>
))

const pickRandom = pipe(values, (list) => {
  const length = list.length
  const randomIndex = Math.floor(Math.random() * length)
  return list[randomIndex]
})

const RandomStyle = ({ t }) => {
  useHairCheck()
  useFaceCheck()
  const [options, updateOptions] = useState(optionValues)
  const [visible, handleVisibleChange] = useState(false)
  const [hairs, dispatch] = useStore('hair')
  const [faces] = useStore('face')
  const [character] = useStore('character.current')
  const dataReady =
    !isEmpty(hairs) &&
    !isEmpty(faces) &&
    !isEmpty(character) &&
    !!character.skin
  const handleChangeStyle = useCallback(() => {
    let changes = {}
    if (includes('hair', options)) {
      const randomHair = pickRandom(hairs)
      const colors = values(randomHair.colors)
      const needMix = colors.length > 1 ? Math.random() > 0.5 : false
      const randomHairColor = pickRandom(colors)
      const hairId = randomHairColor.id
      const hairColorId = getHairColorId(hairId)
      changes.hairId = hairId
      changes.hairColorId = hairColorId
      if (needMix) {
        const randomMixColor = pickRandom(colors)
        changes.mixHairColorId = getHairColorId(randomMixColor.id)
        changes.mixHairOpacity = 0.5
      } else {
        changes.mixHairColorId = hairColorId
      }
    }
    if (includes('face', options)) {
      const randomFace = pickRandom(faces)
      const colors = values(randomFace.colors)
      const needMix = colors.length > 1 ? Math.random() > 0.5 : false
      const randomFaceColor = pickRandom(colors)
      const faceId = randomFaceColor.id
      const faceColorId = getFaceColorId(faceId)
      changes.faceId = faceId
      changes.faceColorId = faceColorId
      if (needMix) {
        const randomMixColor = pickRandom(colors)
        changes.mixFaceColorId = getFaceColorId(randomMixColor.id)
        changes.mixFaceOpacity = 0.5
      } else {
        changes.mixFaceColorId = faceColorId
      }
    }
    if (includes('skin', options)) {
      const randomSkin = pickRandom(Skins)
      changes.skin = randomSkin
    }
    if (includes('ears', options)) {
      const randomEars = pickRandom(Ears)
      changes.earsType = randomEars.id
    }
    !isEmpty(changes) &&
      dispatch({
        type: UPDATE_CHARACTER,
        payload: changes,
      })
  }, [options, hairs, faces])
  return (
    <Fragment>
      <Popover
        trigger="hover"
        placement="topRight"
        title={t('random_title')}
        visible={visible}
        onVisibleChange={handleVisibleChange}
        content={<StyleOptions onChange={updateOptions} />}
      >
        <img
          src="/ed.png"
          alt="Random"
          className={`random-style ${dataReady ? '' : 'random-style__disable'}`}
          onClick={dataReady ? handleChangeStyle : F}
        />
      </Popover>
      <style jsx>{`
        .random-style {
          max-height: 42px;
          cursor: pointer;
        }
        .random-style__disable {
          filter: grayscale(0.9);
          cursor: not-allowed;
        }
      `}</style>
    </Fragment>
  )
}

RandomStyle.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(RandomStyle)
