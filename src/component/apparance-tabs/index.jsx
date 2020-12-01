import React, { useState, useCallback, useEffect, useMemo, memo } from 'react'
import { Card, Select, Row, Col } from 'antd'

import { APIGetWz } from '@api'
import { useStore } from '@store'
import { INITIAL_WZ, CHANGE_REGION } from '@store/meta'

/* component */
import HairTab from './hair-tab'
import FaceTab from './face-tab'
import SkinTab from './skin-tab'
import EarsTab from './ears-tab'
import MixDyeHairTab from './mix-dye-hair-tab'
import MixDyeFaceTab from './mix-dye-face-tab'
import HatTab from './hat-tab'
import OverallTab from './overall-tab'
import TabResizer from './tab-resizer'

/* mapping */
import LanguageToRegion from '@mapping/language-to-region'

/* helper */
import { withTranslation } from '@i18n'
import { assoc, evolve } from 'ramda'

const ApparanceTabMapping = [
  { key: 'hair', tab: 'tab_hair', Component: <HairTab /> },
  { key: 'face', tab: 'tab_face', Component: <FaceTab /> },
  { key: 'skin', tab: 'tab_skin', Component: <SkinTab /> },
  { key: 'ears', tab: 'tab_ears', Component: <EarsTab /> },
  { key: 'mixdyehair', tab: 'tab_mix_dye_hair', Component: <MixDyeHairTab /> },
  { key: 'mixdyeface', tab: 'tab_mix_dye_face', Component: <MixDyeFaceTab /> },
  { key: 'hat', tab: 'tab_hat', Component: <HatTab /> },
  { key: 'overall', tab: 'tab_overall', Component: <OverallTab /> },
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
      if (!region)
        dispatch({
          type: CHANGE_REGION,
          payload: data[LanguageToRegion[language] || 'GMS'],
        })
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
        <Col span={24}>
          <Card
            title={t('character_apparance')}
            bordered={false}
            tabList={translateTab}
            onTabChange={changeTab}
            extra={
              <Select value={region} onChange={handleChangeWz} name="region">
                <Select.Option value="KMS">KMS</Select.Option>
                <Select.Option value="GMS">GMS</Select.Option>
                <Select.Option value="TWMS">TWMS</Select.Option>
                <Select.Option value="JMS">JMS</Select.Option>
                <Select.Option value="CMS">CMS</Select.Option>
              </Select>
            }
          >
            <TabResizer />
            {TabMapping[tab].Component}
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title={t('recent_useage')}
            bordered={false}
            style={{ height: '100%', minHeight: 200 }}
          >
            <div>123</div>
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
