import React, { useState } from 'react'

/* component */
import { Card } from 'antd'
import HairTab from './hair-mix-color'
import FaceTab from './face-mix-color'

/* helper */
import { withTranslation } from '@i18n'
import { assoc } from 'ramda'

const PreviewTabs = [
  { key: 'hair', tab: 'hair', Component: <HairTab /> },
  { key: 'face', tab: 'face', Component: <FaceTab /> },
]

const PreviewTabMapping = PreviewTabs.reduce(
  (mapping, tab) => assoc(tab.key, tab, mapping),
  {}
)

function Preview({ t }) {
  const [previewTab, changePreviewTab] = useState(PreviewTabs[0].key)
  return (
    <Card
      title={t('character_preview_mix_color')}
      bordered={false}
      tabList={PreviewTabs}
      onTabChange={changePreviewTab}
    >
      {PreviewTabMapping[previewTab].Component}
    </Card>
  )
}

Preview.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(Preview)
