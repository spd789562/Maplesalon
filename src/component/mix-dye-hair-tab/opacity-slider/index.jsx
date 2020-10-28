import { memo, useCallback, useMemo, useState, useEffect } from 'react'

/* actions */
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'

/* components */
import { Row, Col, Card, Slider } from 'antd'

/* utils */
import { debounce } from 'throttle-debounce'
import { formatHairId } from '@utils/group-hair'
import useLongPress from '@hooks/use-long-press'
import { F, includes, keys } from 'ramda'

const getMark = (opacity) => {
  // const [_, decimalStr] = opacity.toString().split('.')
  // const decimal = decimalStr ? +decimalStr.padEnd(2, '0') : 0
  return {
    0: `${100 - opacity}%`,
    100: {
      style: { color: 'rgba(0, 0, 0, 0.85)' },
      label: `${opacity}%`,
    },
  }
}

const OpacitySlider = () => {
  const [mixHairOpacity, dispatch] = useStore('meta.character.mixHairOpacity')
  const [opacity, updateOpacity] = useState((mixHairOpacity * 1000) / 10)

  useEffect(() => updateOpacity((mixHairOpacity * 1000) / 10), [mixHairOpacity])

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

  const handleChange = useCallback((value) => {
    const val = value < 0 ? 0 : value > 100 ? 100 : value
    updateOpacity(val)
    handleChangeOpacity(val)
  }, [])

  const handleArrow = useCallback(
    (modify) => () => {
      handleChange(opacity + modify)
    },
    [opacity, handleChange]
  )

  const handleAdd = useLongPress(handleArrow(1), 80)
  const handleSubtract = useLongPress(handleArrow(-1), 80)

  const marks = useMemo(() => getMark(opacity), [opacity])
  return (
    <Row>
      <Col flex="0 0 30px">
        <div
          className="mix-opacity-arrow mix-opacity-arrow__left"
          {...handleSubtract}
        />
      </Col>
      <Col flex="1">
        <div className="mix-opacity-slider">
          <Slider
            marks={marks}
            value={opacity}
            onChange={handleChange}
            tooltipVisible={false}
            included
          />
        </div>
      </Col>
      <Col flex="0 0 30px">
        <div
          className="mix-opacity-arrow mix-opacity-arrow__right"
          {...handleAdd}
        />
      </Col>
      <style jsx>{`
        .mix-opacity-slider {
          margin-left: auto;
          margin-right: auto;
          width: 80%;
        }
        .mix-opacity-arrow {
          border-top-width: 15px;
          border-bottom-width: 15px;
          border-style: solid;
          border-color: transparent #aaa;
          cursor: pointer;
        }
        .mix-opacity-arrow__left {
          border-right-width: 20px;
          border-left-width: 0px;
          margin-left: auto;
        }
        .mix-opacity-arrow__right {
          border-left-width: 20px;
          border-right-width: 0px;
          margin-right: auto;
        }
      `}</style>
    </Row>
  )
}

export default memo(OpacitySlider)
