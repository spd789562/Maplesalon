import { useCallback, memo } from 'react'

import { debounce } from 'throttle-debounce'

import { useStore } from '@store'
import { SEARCH_UPDATE } from '@store/search'

/* components */
import { Input, Row, Col, Select } from 'antd'

import { withTranslation } from '@i18n'

const SearchBar = ({ t }) => {
  const [searchParam, dispatch] = useStore('search.overall')
  const handleSearch = useCallback(
    debounce(250, (field, value) => {
      dispatch({
        type: SEARCH_UPDATE,
        payload: {
          type: 'overall',
          field,
          value,
        },
      })
    }),
    []
  )
  return (
    <Row gutter={[8, 8]}>
      <Col xs={24} sm={24}>
        <Input.Search
          placeholder={t('type_overall_name')}
          defaultValue={searchParam.name}
          onChange={({ target: { value } }) => handleSearch('name', value)}
          style={{ width: '100%' }}
          allowClear
        />
      </Col>
      {/* <Col xs={8} span={6}>
        <Select
          defaultValue={searchParam.gender}
          onChange={(value) => handleSearch('gender', value)}
          defaultValue={searchParam.gender}
          style={{ width: '100%' }}
        >
          <Select.Option value="">{t('filter_gender_all')}</Select.Option>
          <Select.Option value="0">{t('filter_gender_male')}</Select.Option>
          <Select.Option value="1">{t('filter_gender_female')}</Select.Option>
          <Select.Option value="2">{t('filter_gender_general')}</Select.Option>
        </Select>
      </Col> */}
    </Row>
  )
}

SearchBar.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default memo(withTranslation('index')(SearchBar))
