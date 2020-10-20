import React, { useState, useCallback, useEffect, useMemo, memo } from 'react'
import dynamic from 'next/dynamic'
import {
  Layout,
  Form,
  InputNumber,
  Row,
  Col,
  BackTop,
  Card,
  Avatar,
  Tooltip,
  Switch,
  Select,
  Button,
} from 'antd'

import { APIGetWz } from '@api'
import { useStore } from '@store'
import { INITIAL_WZ, CHANGE_REGION } from '@store/meta'

/* component */
import HairTab from '@components/hair-tab'
import CharacterDifferent from '@components/character-different'
import CharacterList from '@components/character-list'

/* mapping */
import LanguageToRegion from '@mapping/language-to-region'

/* helper */
import { withTranslation } from '../src/i18n'
import { assoc } from 'ramda'

import styles from '../styles/Home.module.css'

const { Header, Content, Footer } = Layout

const initialValues = {}

const ApparanceTabs = [
  { key: 'hair', tab: 'hair', Component: <HairTab></HairTab> },
  { key: 'face', tab: 'face', Component: <div>face</div> },
  { key: 'skin', tab: 'skin', Component: <div>skin</div> },
  { key: 'mixdye', tab: 'mix_dye', Component: <div>mix dye</div> },
]

const TabMapping = ApparanceTabs.reduce(
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

function Home({ t, i18n }) {
  const { region, handleChangeWz } = useInitWz(i18n.language)
  const [tab, changeTab] = useState(ApparanceTabs[0].key)
  // const TabComponent = useMemo(() => TabMapping[tab].Component, [tab])
  return useMemo(
    () => (
      <Layout className="layout">
        <Header className={styles.header}>
          <div className={styles['header-container']}>
            <h2 style={{ marginBottom: 0 }}>
              {t('title')}
              &nbsp;
            </h2>
            <div>
              <Select
                onChange={(value) =>
                  i18n.changeLanguage && i18n.changeLanguage(value)
                }
                defaultValue={i18n.language}
              >
                <Select.Option value="en">English</Select.Option>
                <Select.Option value="zh_tw">繁體中文</Select.Option>
                <Select.Option value="zh_cn">简体中文</Select.Option>
              </Select>
            </div>
          </div>
        </Header>
        <BackTop />
        <Content className={styles.content}>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={12} xl={8}>
              <Card
                title={t('character_apparance')}
                bordered={false}
                tabList={ApparanceTabs}
                onTabChange={changeTab}
                extra={
                  <Select
                    defaultValue={region}
                    onChange={handleChangeWz}
                    name="region"
                  >
                    <Select.Option value="GMS">GMS</Select.Option>
                    <Select.Option value="TWMS">TWMS</Select.Option>
                    <Select.Option value="KMS">KMS</Select.Option>
                    <Select.Option value="CMS">CMS</Select.Option>
                  </Select>
                }
              >
                {TabMapping[tab].Component}
              </Card>
            </Col>
            <Col span={24} lg={12} xl={16}>
              <Card title={t('character')} bordered={false}>
                <CharacterDifferent />
                <CharacterList />
              </Card>
            </Col>
          </Row>
        </Content>
        <Footer className={styles.footer}>
          {t('title')} ©2020 Created by 丫村, data from maplestory.io
        </Footer>
      </Layout>
    ),
    [i18n.language, region, tab]
  )
}

Home.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(memo(Home))
