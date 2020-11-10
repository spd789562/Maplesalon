import { Fragment } from 'react'
import App from 'next/app'
import Head from 'next/head'
import { Layout, Select, BackTop } from 'antd'
import { appWithTranslation, withTranslation, Link } from '../src/i18n'
import { Provider } from '../src/store'
import '../styles/antd.less'
import '../styles/globals.css'

import styles from '../styles/Home.module.css'

const { Header, Content, Footer } = Layout

const NextHead = withTranslation('index')(({ t, i18n: { language } }) => (
  <Head>
    <title>{t('seo_title')}</title>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta name="description" content={t('seo_desc')} />
    <meta
      name="keywords"
      content="Maplstory Hair,Maplstory Face,Maplstory Mix Dye,Hair cut,楓之谷美髮,楓之谷美容,楓之谷混染"
    />
    <meta property="og:type" content="website" />
    <meta property="og:description" content={t('seo_desc')} />
    <meta
      property="og:url"
      content="https://maplestory-maplesalon.vercel.app/"
    />
    <meta property="og:locale" content={language} />
    <meta property="og:site_name" content={t('title')} />
    <meta property="og:title" content={t('seo_title')} />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap"
      rel="stylesheet"
    />
    {language === 'zh_cn' && (
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap"
        rel="stylesheet"
      />
    )}
  </Head>
))

const AppHeader = withTranslation('index')(({ t, i18n }) => (
  <Header className={styles.header}>
    <div className={styles['header-container']}>
      <Link href="/">
        <h2 style={{ marginBottom: 0, cursor: 'pointer' }}>
          {t('title')}
          &nbsp;
        </h2>
      </Link>
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
))

const AppFooter = withTranslation('index')(({ t }) => (
  <Footer className={styles.footer}>
    <div>
      Other tools：
      <a href="https://maplestory-arcane-symbol-calculator.vercel.app/">
        Arcane Calcaulator
      </a>
    </div>
    {t('title')} ©2020 Created by 丫村, data from maplestory.io
  </Footer>
))

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <NextHead />
      <AppHeader />
      <BackTop />
      <Content>
        <Provider className={styles.content}>
          <Component {...pageProps} />
        </Provider>
      </Content>
      <AppFooter />
    </Fragment>
  )
}

MyApp.getInitialProps = async (appContext) => ({
  ...(await App.getInitialProps(appContext)),
})

export default appWithTranslation(MyApp)
