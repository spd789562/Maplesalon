/* components */
import { Radio } from 'antd'

const ScaleOption = [
  { label: '1x', value: 'origin' },
  { label: '1.5x', value: 'origin-1.5' },
  { label: 'Full', value: 'full' },
]

const Scale = ({ onChange }) => {
  return (
    <div className="different-scale">
      <Radio.Group
        options={ScaleOption}
        optionType="button"
        buttonStyle="solid"
        style={{ width: '100%' }}
        onChange={({ target: { value } }) => onChange(value)}
        defaultValue={'full'}
      />
      <style jsx>{`
        .different-scale {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default Scale
