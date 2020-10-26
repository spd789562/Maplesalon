import React, { useLayoutEffect, useCallback, createRef } from 'react'

import { useDispatch } from '@store'
import { WIDTH_UPDATE } from '@store/search'

import { debounce } from 'throttle-debounce'

const widthRef = createRef()

const TabResizer = () => {
  const dispatch = useDispatch()
  const updateWidth = useCallback(
    debounce(200, () =>
      dispatch({ type: WIDTH_UPDATE, payload: widthRef.current.offsetWidth })
    ),
    [widthRef.current]
  )
  useLayoutEffect(() => {
    window.addEventListener('resize', updateWidth)
    updateWidth()
    return () => window.removeEventListener('resize', updateWidth)
  }, [])
  return <div ref={widthRef}></div>
}

export default TabResizer
