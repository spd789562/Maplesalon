import React, { useState } from 'react'

/* component */
import { Card } from 'antd'
import HairTab from './hair-color'
import FaceTab from './face-color'
// import SkinTab from './skin'
// import EarsTab from './ears'

/* helper */
import { withTranslation } from '@i18n'
import { assoc } from 'ramda'

const PreviewTabs = [
  { key: 'hair', tab: 'hair', Component: <HairTab /> },
  { key: 'face', tab: 'face', Component: <FaceTab /> },
  // { key: 'skin', tab: 'skin', Component: <SkinTab /> },
  // { key: 'ears', tab: 'ears', Component: <EarsTab /> },
]

const PreviewTabMapping = PreviewTabs.reduce(
  (mapping, tab) => assoc(tab.key, tab, mapping),
  {}
)

function Preview({ t }) {
  const [previewTab, changePreviewTab] = useState(PreviewTabs[0].key)
  return (
    <Card
      title={t('character_preview_all_color')}
      bordered={false}
      tabList={PreviewTabs}
      onTabChange={changePreviewTab}
    >
      {PreviewTabMapping[previewTab].Component}
      <style jsx global>{`
        .table-column__active {
          background-color: #dee4fc !important;
        }
      `}</style>
    </Card>
  )
}

Preview.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(Preview)
