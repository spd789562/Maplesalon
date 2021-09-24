import React, { useState, useCallback, useEffect, useMemo, memo } from 'react'

import { APIGetWz } from '@api'
import { useStore } from '@store'
import { INITIAL_WZ, CHANGE_REGION, UPDATE_REGION_VERSION } from '@store/meta'

/* component */
import {
  faUser,
  faGrinAlt,
  faMale,
  faEyeDropper,
  faHatCowboySide,
  faTshirt,
} from '@fortawesome/free-solid-svg-icons'
import { Card, Select, Row, Col } from 'antd'
import Tab from './tab'
import HairTab from './hair-tab'
import FaceTab from './face-tab'
import SkinTab from './skin-tab'
import EarsTab from './ears-tab'
import MixDyeHairTab from './mix-dye-hair-tab'
import MixDyeFaceTab from './mix-dye-face-tab'
import HatTab from './hat-tab'
import OverallTab from './overall-tab'
import History from './history'
import TabResizer from './tab-resizer'

/* mapping */
import LanguageToRegion from '@mapping/language-to-region'

/* helper */
import { withTranslation } from '@i18n'
import { assoc, evolve } from 'ramda'

const ApparanceTabMapping = [
  { key: 'hair', tab: 'tab_hair', icon: faUser, Component: <HairTab /> },
  { key: 'face', tab: 'tab_face', icon: faGrinAlt, Component: <FaceTab /> },
  { key: 'skin', tab: 'tab_skin', icon: faMale, Component: <SkinTab /> },
  { key: 'ears', tab: 'tab_ears', icon: 'ears', Component: <EarsTab /> },
  {
    key: 'mixdyehair',
    tab: 'tab_mix_dye_hair',
    icon: 'hair-mixdye',
    Component: <MixDyeHairTab />,
  },
  {
    key: 'mixdyeface',
    tab: 'tab_mix_dye_face',
    icon: faEyeDropper,
    Component: <MixDyeFaceTab />,
  },
  { key: 'hat', tab: 'tab_hat', icon: faHatCowboySide, Component: <HatTab /> },
  {
    key: 'overall',
    tab: 'tab_overall',
    icon: faTshirt,
    Component: <OverallTab />,
  },
]

const TabMapping = ApparanceTabMapping.reduce(
  (mapping, tab) => assoc(tab.key, tab, mapping),
  {}
)

const useInitWz = (language) => {
  const [region, dispatch] = useStore('meta.region.region', '')
  useEffect(() => {
    APIGetWz().then((data) => {
      dispatch({ type: INITIAL_WZ, payload: data })
      if (!region) {
        dispatch({
          type: CHANGE_REGION,
          payload: data[LanguageToRegion[language] || 'GMS'],
        })
      } else {
        dispatch({ type: UPDATE_REGION_VERSION, payload: data[region].version })
      }
    })
  }, [])
  const handleChangeWz = (value) =>
    dispatch({
      type: CHANGE_REGION,
      payload: value,
    })
  return { region, handleChangeWz }
}

function ApparanceTabs({ t, i18n }) {
  const { region, handleChangeWz } = useInitWz(i18n.language)
  const [tab, changeTab] = useState(ApparanceTabMapping[0].key)
  const translateTab = useMemo(
    () => ApparanceTabMapping.map(evolve({ tab: t })),
    [i18n.language]
  )
  return useMemo(
    () => (
      <Row style={{ height: '100%' }}>
        <Col span={24} style={{ paddingBottom: 8 }}>
          <Card
            title={t('character_apparance')}
            bordered={false}
            tabList={translateTab}
            onTabChange={changeTab}
            tabProps={{
              renderTabBar: ({ activeKey, onTabClick }) => (
                <Tab
                  tabs={translateTab}
                  activeKey={activeKey}
                  onTabClick={onTabClick}
                />
              ),
            }}
            extra={
              <Select value={region} onChange={handleChangeWz} name="region">
                <Select.Option value="KMS">KMS</Select.Option>
                <Select.Option value="KMST">KMST</Select.Option>
                <Select.Option value="GMS">GMS</Select.Option>
                <Select.Option value="TWMS">TWMS</Select.Option>
                <Select.Option value="JMS">JMS</Select.Option>
                <Select.Option value="CMS">CMS</Select.Option>
                <Select.Option value="SEA">SEA</Select.Option>
              </Select>
            }
          >
            <TabResizer />
            {TabMapping[tab].Component}
          </Card>
        </Col>
        <Col span={24} style={{ paddingTop: 8 }}>
          <Card
            title={
              <span>
                {t('item_history')}
                <span style={{ fontSize: 12, color: '#999' }}>
                  ({t('history_limit', { count: 20 })})
                </span>
              </span>
            }
            bordered={false}
            style={{ height: '100%', minHeight: 220 }}
            bodyStyle={{ height: 'calc(100% - 58px)' }}
          >
            <History />
          </Card>
        </Col>
      </Row>
    ),
    [region, tab]
  )
}

ApparanceTabs.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(memo(ApparanceTabs))
