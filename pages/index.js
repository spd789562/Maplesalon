import React, { memo } from 'react'
import { Row, Col, Card } from 'antd'

/* component */
import ApparanceTabs from '@components/apparance-tabs'
import Preview from '@components/preview'
import MixPreview from '@components/preview/mix-preview'
import CharacterDifferent from '@components/character-different'
import CharacterList from '@components/character-list'
import RandomStyle from '@components/random-style'

/* helper */
import { withTranslation } from '@i18n'

function Home({ t }) {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24} lg={12} xl={8}>
        <ApparanceTabs />
      </Col>
      <Col span={24} lg={12} xl={16}>
        <Card
          title={t('character_comparison')}
          bordered={false}
          extra={<RandomStyle />}
        >
          <CharacterDifferent />
        </Card>
        <Card title={t('character_list')} bordered={false}>
          <CharacterList />
        </Card>
      </Col>
      <Col span={24}>
        <Preview />
      </Col>
      <Col span={24}>
        <MixPreview />
      </Col>
    </Row>
  )
}

Home.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(memo(Home))
