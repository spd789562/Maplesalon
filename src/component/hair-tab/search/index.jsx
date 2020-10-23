import { useCallback, memo } from 'react'

import { debounce } from 'throttle-debounce'

import { useStore } from '@store'
import { SEARCH_UPDATE } from '@store/search'

/* components */
import { Input, Row, Col, Select } from 'antd'
const SearchBar = () => {
  const [searchParam, dispatch] = useStore('search.hair')
  const handleSearch = useCallback(
    debounce(250, (field, value) => {
      dispatch({
        type: SEARCH_UPDATE,
        payload: {
          type: 'hair',
          field,
          value,
        },
      })
    }),
    []
  )
  return (
    <Row gutter={[8, 8]}>
      <Col span={18}>
        <Input.Search
          placeholder="type_hair_name"
          defaultValue={searchParam.name}
          onChange={({ target: { value } }) => handleSearch('name', value)}
          style={{ width: '100%' }}
        />
      </Col>
      <Col span={6}>
        <Select
          defaultValue={searchParam.gender}
          onChange={(value) => handleSearch('gender', value)}
          defaultValue={searchParam.gender}
          style={{ width: '100%' }}
        >
          <Select.Option value="">all</Select.Option>
          <Select.Option value="0">0</Select.Option>
          <Select.Option value="1">1</Select.Option>
          <Select.Option value="2">2</Select.Option>
        </Select>
      </Col>
    </Row>
  )
}

export default memo(SearchBar)
