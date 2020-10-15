import React, { Fragment, useCallback, useEffect } from 'react'
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

/* component */

/* mapping */

/* helper */
import { withTranslation } from '../src/i18n'

import styles from '../styles/Home.module.css'

const { Header, Content, Footer } = Layout

const initialValues = {}

function Home({ t, i18n }) {
  return (
    <Layout className="layout">
      <Header className={styles.header}>
        <div className={styles['header-container']}>
          <h2 style={{ marginBottom: 0 }}>
            {t('title')}
            &nbsp;
          </h2>
          <div style={{ marginLeft: 'auto', marginRight: '4rem' }}>
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
      <Content className={styles.content}></Content>
      <Footer className={styles.footer}>
        Maplestory Salon ©2020 Created by 丫村
      </Footer>
    </Layout>
  )
}

Home.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(Home)
