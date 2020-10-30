import { useEffect } from 'react'
import { useStore } from '@store'

/* api */
import { APIGetHair, APIGetFace } from '@api'

/* action */
import { HAIR_INITIAL } from '@store/hair'
import { FACE_INITIAL } from '@store/face'
import { CHANGE_DATA_REGION } from '@store/meta'

/* utils */
import groupHair from '@utils/group-hair'
import groupFace from '@utils/group-face'

const useCheckData = (field) => {
  const APIGetData = field === 'hair' ? APIGetHair : APIGetFace
  const DATA_ACTION = field === 'hair' ? HAIR_INITIAL : FACE_INITIAL
  const dataGruoper = field === 'hair' ? groupHair : groupFace
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

export default useCheckData
