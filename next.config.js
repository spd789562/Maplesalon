const { nextI18NextRewrites } = require('next-i18next/rewrites')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withSass = require('@zeit/next-sass')
const withLess = require('@zeit/next-less')
const withCSS = require('@zeit/next-css')
const path = require('path')
const config = require('./config')

const composeConfig = (...configs) => (defaultConfig) =>
  configs.reduce(
    (resultConfig, configFunc) => configFunc(resultConfig),
    defaultConfig
  )

const withOtherParam = (configFunc, param) => (config) =>
  configFunc(Object.assign(config, param))

const isProd = process.env.NODE_ENV === 'production'

const localeSubpaths = {
  en: 'en',
  zh_tw: 'zh_tw',
  zh_cn: 'zh_cn',
}

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {}
}

module.exports = composeConfig(
  withSass,
  withLess,
  withOtherParam(withCSS, {
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: '[local]___[hash:base64:5]',
    },
  }),
  withBundleAnalyzer
)({
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  webpack(config, options) {
    if (!options.isServer && config.mode === 'development') {
      const { I18NextHMRPlugin } = require('i18next-hmr/plugin')
      config.plugins.push(
        new I18NextHMRPlugin({
          localesDir: path.resolve(__dirname, 'public/static/locales'),
        })
      )
    }

    config.plugins.push(new MomentLocalesPlugin())
    config.resolve.modules.push(path.resolve('./'))

    return config
  },
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    ...config,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || '',
    localeSubpaths,
    isProd,
  },
  experimental: {
    jsconfigPaths: true,
  },
})
