import { useCallback, memo } from 'react'

import { debounce } from 'throttle-debounce'

/* components */
import { Input, Row, Col, Select } from 'antd'
const SearchBar = ({ searchParam, updateSearchParam }) => {
  const handleSearch = useCallback(
    debounce(250, (field, value) => {
      updateSearchParam({
        ...searchParam,
        [field]: value,
      })
    }),
    [searchParam]
  )
  return (
    <Row gutter={[8, 8]}>
      <Col span={18}>
        <Input.Search
          placeholder="type_hair_name"
          onChange={({ target: { value } }) => handleSearch('name', value)}
          style={{ width: '100%' }}
        />
      </Col>
      <Col span={6}>
        <Select
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
