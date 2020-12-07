import React, { useEffect, useCallback, createRef } from 'react'

import { useDispatch } from '@store'
import { WIDTH_UPDATE } from '@store/search'

import { debounce } from 'throttle-debounce'

const widthRef = createRef()

const TabResizer = () => {
  const dispatch = useDispatch()
  const updateWidth = useCallback(
    debounce(200, () => {
      if (widthRef.current)
        dispatch({ type: WIDTH_UPDATE, payload: widthRef.current.offsetWidth })
    }),
    [widthRef.current]
  )
  useEffect(() => {
    window.addEventListener('resize', updateWidth)
    if (widthRef.current) {
      widthRef.current.addEventListener('resize', updateWidth)
    }
    updateWidth()
    return () => {
      window.removeEventListener('resize', updateWidth)
      if (widthRef.current) {
        widthRef.current.removeEventListener('resize', updateWidth)
      }
    }
  }, [])
  return <div ref={widthRef}></div>
}

export default TabResizer
