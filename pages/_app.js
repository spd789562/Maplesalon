import { Fragment } from 'react'
import App from 'next/app'
import Head from 'next/head'
import { appWithTranslation, withTranslation } from '../src/i18n'
import '../styles/antd.less'
import '../styles/globals.css'

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

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <NextHead />
      <Component {...pageProps} />
    </Fragment>
  )
}

MyApp.getInitialProps = async (appContext) => ({
  ...(await App.getInitialProps(appContext)),
})

export default appWithTranslation(MyApp)
