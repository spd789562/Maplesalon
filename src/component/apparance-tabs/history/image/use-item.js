import { useCallback } from 'react'
/* store */
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'

/* utils */
import { clone, pick } from 'ramda'

const pickData = pick(['id', 'region', 'version'])

const TypeMapping = {
  hair: {
    payload: (data) => ({
      hair: { colorId: data.colorId, ...pickData(data) },
      mixHairColorId: data.colorId,
    }),
  },
  face: {
    payload: (data) => ({
      face: { colorId: data.colorId, ...pickData(data) },
      mixFaceColorId: data.colorId,
    }),
  },
  hat: {
    payload: (data) => ({ hat: pickData(data) }),
  },
  overall: {
    payload: (data) => ({ overall: pickData(data) }),
  },
  skin: {
    payload: (data) => ({ hair: pickData(data) }),
    src: ({ region, version, id }) =>
      `https://maplestory.io/api/${region}/${version}/character/${id}`,
  },
  ears: {
    payload: ({ id }) => ({ earsType: id }),
    src: ({ query }, { skin, region, version }) =>
      `https://maplestory.io/api/${
        skin.region ? `${skin.region}/${skin.version}` : `${region}/${version}`
      }/character/${skin.id || 2000}?${query ? `${query}=true` : ''}`,
  },
}

const getSrc = ({ region, version, id }) =>
  `https://maplestory.io/api/${region}/${version}/item/${id}/icon`

const useItem = (item) => {
  let _item = clone(item)
  const [currentSkin, dispatch] = useStore('meta.character.skin')
  const [{ region, version }] = useStore('meta.region')
  const { src, payload } = TypeMapping[_item.type] || {}
  _item.region = _item.region || region
  _item.version = _item.version || version
  const handleChange = useCallback(() => {
    dispatch({
      type: UPDATE_CHARACTER,
      payload: payload(_item),
    })
  }, [_item.id, currentSkin, region, version])

  const iconSrc = src
    ? src(_item, { skin: currentSkin, region, version })
    : getSrc(_item)

  return {
    iconSrc,
    handleChange,
  }
}

export default useItem
