import { useState, useEffect } from 'react'

const useLongPress = function useLongPress(callback = () => {}, ms = 100) {
  const [startLongPress, setStartLongPress] = useState(false)
  const [isClick, setClickState] = useState('init')
  useEffect(() => {
    let timerId
    if (startLongPress) {
      timerId = setTimeout(() => {
        setClickState('press')
      }, 500)
    } else {
      clearTimeout(timerId)
      setClickState((state) => {
        state === 'leave' && callback()
        return 'leave'
      })
    }

    return () => {
      clearTimeout(timerId)
    }
  }, [startLongPress])
  useEffect(() => {
    let timerId
    if (startLongPress && isClick === 'press') {
      timerId = setTimeout(callback, ms)
    } else {
      clearTimeout(timerId)
    }

    return () => {
      clearTimeout(timerId)
    }
  }, [callback, ms, startLongPress, isClick])

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false),
  }
}

export default useLongPress
