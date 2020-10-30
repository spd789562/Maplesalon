import { useCallback, memo } from 'react'

/* action */
import { useStore } from '@store'
import { SEARCH_UPDATE } from '@store/search'

/* components */
import { Input, Row, Col, Select } from 'antd'

/* utils */
import { debounce } from 'throttle-debounce'

const SearchBar = () => {
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
      <Col span={18}>
        <Input.Search
          placeholder="type_face_name"
          defaultValue={searchParam.name}
          onChange={({ target: { value } }) => handleSearch('name', value)}
          style={{ width: '100%' }}
          allowClear
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
