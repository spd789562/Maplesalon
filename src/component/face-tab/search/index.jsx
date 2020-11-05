import { useCallback, memo } from 'react'

/* action */
import { useStore } from '@store'
import { SEARCH_UPDATE } from '@store/search'

/* components */
import { Input, Row, Col, Select } from 'antd'

/* i18n */
import { withTranslation } from '@i18n'

/* utils */
import { debounce } from 'throttle-debounce'

const SearchBar = ({ t }) => {
  const [searchParam, dispatch] = useStore('search.hair')
  const handleSearch = useCallback(
    debounce(250, (field, value) => {
      dispatch({
        type: SEARCH_UPDATE,
        payload: {
          type: 'face',
          field,
          value,
        },
      })
    }),
    []
  )
  return (
    <Row gutter={[8, 8]}>
      <Col xs={16} sm={18}>
        <Input.Search
          placeholder={t('type_face_name')}
          defaultValue={searchParam.name}
          onChange={({ target: { value } }) => handleSearch('name', value)}
          style={{ width: '100%' }}
          allowClear
        />
      </Col>
      <Col xs={8} span={6}>
        <Select
          onChange={(value) => handleSearch('gender', value)}
          defaultValue={searchParam.gender}
          style={{ width: '100%' }}
        >
          <Select.Option value="">{t('filter_gender_all')}</Select.Option>
          <Select.Option value="0">{t('filter_gender_male')}</Select.Option>
          <Select.Option value="1">{t('filter_gender_female')}</Select.Option>
          <Select.Option value="2">{t('filter_gender_general')}</Select.Option>
        </Select>
      </Col>
    </Row>
  )
}

SearchBar.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default memo(withTranslation('index')(SearchBar))
