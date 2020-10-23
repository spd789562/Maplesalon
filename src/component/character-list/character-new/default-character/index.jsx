import { Fragment } from 'react'

/* components */
import { Card, Row, Col } from 'antd'
import CharacterImage from '@components/character-image'

import DefaultCharacters from './characters.json'

const DefaultCharacter = ({ id, handleSelect }) => {
  return (
    <Fragment>
      {DefaultCharacters.map(({ title, list }) => (
        <Card
          key={`${title}-list`}
          title={title}
          bordered={false}
          style={{ marginLeft: -24, marginRight: -24 }}
        >
          <Row gutter={[8, 8]}>
            {list.map((character, index) => (
              <Col span={6} md={4} key={`${character.id}-${index}-item`}>
                <div
                  className={`default-character ${
                    character.id === id ? 'default-character__select' : ''
                  }`}
                  onClick={() => handleSelect(character)}
                >
                  <CharacterImage characterData={character} />
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      ))}
      <style jsx>{`
        .default-character {
          border-radius: 8px;
          border: 2px solid transparent;
        }
        .default-character__select {
          border-color: #6373ca;
        }
      `}</style>
    </Fragment>
  )
}

export default DefaultCharacter