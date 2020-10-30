import { memo } from 'react'

const ColorDot = ({ color, name }) => (
  <div className="color-dot" style={{ backgroundColor: color }} title={name}>
    <style jsx>{`
      .color-dot {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: inline-block;
      }
    `}</style>
  </div>
)

export default memo(ColorDot)
