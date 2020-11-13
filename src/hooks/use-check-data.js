import { useEffect } from 'react'
import { useStore } from '@store'

/* api */
import { APIGetHair, APIGetFace, APIGetHat, APIGetCloth } from '@api'

/* action */
import { HAIR_INITIAL } from '@store/hair'
import { FACE_INITIAL } from '@store/face'
import { HAT_INITIAL } from '@store/hat'
import { OVERALL_INITIAL } from '@store/overall'
import { CHANGE_DATA_REGION } from '@store/meta'

/* utils */
import groupHair from '@utils/group-hair'
import groupFace from '@utils/group-face'
import { identity } from 'ramda'

const mapping = {
  hair: { api: APIGetHair, action: HAIR_INITIAL, grouper: groupHair },
  face: { api: APIGetFace, action: FACE_INITIAL, grouper: groupFace },
  hat: { api: APIGetHat, action: HAT_INITIAL, grouper: identity },
  overall: { api: APIGetCloth, action: OVERALL_INITIAL, grouper: identity },
}

const useCheckData = (field) => {
  const APIGetData = mapping[field].api
  const DATA_ACTION = mapping[field].action
  const dataGruoper = mapping[field].grouper
  return () => {
    const [regionData, dispatch] = useStore('meta.region')
    const { region, version, [field]: fieldRegion } = regionData
    useEffect(() => {
      if (region && version && region !== fieldRegion) {
        APIGetData({ region, version }).then((data) => {
          dispatch({
            type: DATA_ACTION,
            payload: dataGruoper(data),
          })
          dispatch({
            type: CHANGE_DATA_REGION,
            payload: {
              field,
              region,
            },
          })
        })
      }
    }, [region, version])

    return regionData
  }
}

export const useHairCheck = useCheckData('hair')
export const useFaceCheck = useCheckData('face')
export const useHatCheck = useCheckData('hat')
export const useOverallCheck = useCheckData('overall')

export default useCheckData
