import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Row, Col, Tooltip } from 'antd'
import Ears from './ears.svg.js'
import HairMixdye from './hair-mixdye.svg.js'

const iconMapping = {
  'hair-mixdye': <HairMixdye />,
  ears: <Ears />,
}

const Tab = ({ tabs, activeKey, onTabClick }) => (
  <Row style={{ marginTop: 4, marginBottom: 17 }}>
    {tabs.map(({ key, tab, icon }) => (
      <Col span={6} md={3} key={key}>
        <Tooltip title={tab}>
          <div
            className={`tab ${activeKey === key ? 'tab__active' : ''}`}
            onClick={() => onTabClick(key)}
          >
            {typeof icon === 'string' ? (
              iconMapping[icon]
            ) : (
              <FontAwesomeIcon icon={icon} />
            )}
          </div>
        </Tooltip>
      </Col>
    ))}
    <style jsx global>{`
      .tab {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #98a2da;
        cursor: pointer;
      }
      .tab__active {
        color: #fff;
        background-color: #6373ca;
      }
    `}</style>
  </Row>
)

export default Tab
