import { useMemo, memo } from 'react'

/* store */
import { useStore } from '@store'

/* components */
import { Row, Col } from 'antd'
import CharacterImage from '@components/character-image'

/* utils */
import { clone, isEmpty, mergeRight } from 'ramda'

const CharacterDifferent = () => {
  const [currentCharacter] = useStore('character.current', {})
  const [characterChanges] = useStore('meta.character', {})
  const [regionData] = useStore('meta.region', {})

  const changedCharacter = useMemo(() => {
    if (isEmpty(currentCharacter)) return currentCharacter
    const copyCharacter = clone(currentCharacter)
    copyCharacter.isChange = false
    if (characterChanges.skinId) {
      copyCharacter.skin = characterChanges.skinId
      copyCharacter.selectedItems.Body = mergeRight(
        copyCharacter.selectedItems.Body || {},
        {
          id: +characterChanges.skinId,
          ...regionData,
        }
      )
      copyCharacter.selectedItems.Head = mergeRight(
        copyCharacter.selectedItems.Head || {},
        {
          id: +characterChanges.skinId + 10000,
          ...regionData,
        }
      )
      copyCharacter.isChange = true
    }
    if (characterChanges.hairId !== copyCharacter.selectedItems.Hair.id) {
      copyCharacter.selectedItems.Hair = mergeRight(
        copyCharacter.selectedItems.Hair || {},
        {
          id: characterChanges.hairId,
          ...regionData,
        }
      )
      copyCharacter.isChange = true
    }
    if (characterChanges.faceId) {
      copyCharacter.selectedItems.Face = mergeRight(
        copyCharacter.selectedItems.Face || {},
        {
          id: characterChanges.faceId,
          ...regionData,
        }
      )
      copyCharacter.isChange = true
    }
    // has mix dye hair
    if (
      characterChanges.mixHairColorId !== characterChanges.hairColorId ||
      characterChanges.mixFaceColorId !== characterChanges.faceColorId
    ) {
      copyCharacter.mixDye = {
        hairColorId: characterChanges.mixHairColorId,
        hairOpacity: characterChanges.mixHairOpacity,
      }
      // has different mix color
      if (
        currentCharacter.mixDye &&
        currentCharacter.mixDye.hairColorId !== copyCharacter.mixDye.hairColorId
      ) {
        copyCharacter.isChange = true
      }
    } else {
      copyCharacter.mixDye = undefined
      // cancle mix color
      if (currentCharacter.mixDye) {
        copyCharacter.isChange = true
      }
    }
    return copyCharacter
  }, [regionData, currentCharacter, characterChanges])

  return (
    <Row style={{ maxWidth: 500, margin: '0 auto' }}>
      <Col flex={1}>
        <CharacterImage characterData={currentCharacter} />
      </Col>
      <Col flex="100px" className="changearrow">
        <div className="changearrow">&gt;</div>
      </Col>
      <Col flex={1}>
        {changedCharacter.isChange && (
          <CharacterImage characterData={changedCharacter} />
        )}
      </Col>
      <style jsx>{`
        .changearrow {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      `}</style>
    </Row>
  )
}

export default CharacterDifferent
