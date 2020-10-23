import { useMemo, useCallback, memo } from 'react'

/* store */
import { useStore } from '@store'
import { UPDATE_CHARACTER } from '@store/meta'
import { CHARACTER_UPDATE, CHARACTER_CHANGE } from '@store/character'

/* components */
import { Row, Col, Button } from 'antd'
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import CharacterImage from '@components/character-image'

/* utils */
import { clone, isEmpty, mergeRight } from 'ramda'

const CharacterDifferent = () => {
  const [currentCharacter, dispatch] = useStore('character.current', {})
  const [characterChanges] = useStore('meta.character', {})
  const [regionData] = useStore('meta.region', {})

  const changedCharacter = useMemo(() => {
    if (isEmpty(currentCharacter)) return currentCharacter
    const copyCharacter = clone(currentCharacter)
    copyCharacter.isChange = false
    if (characterChanges.name) {
      copyCharacter.name = characterChanges.name
      copyCharacter.isChange = true
    }
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
    if (
      characterChanges.hairId &&
      characterChanges.hairId !== copyCharacter.selectedItems.Hair.id
    ) {
      copyCharacter.selectedItems.Hair = mergeRight(
        copyCharacter.selectedItems.Hair || {},
        {
          id: characterChanges.hairId,
          ...regionData,
        }
      )
      copyCharacter.isChange = true
    }
    if (
      characterChanges.faceId &&
      characterChanges.faceId !== copyCharacter.selectedItems.Face.id
    ) {
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
      (characterChanges.mixHairColorId &&
        characterChanges.mixHairColorId !== characterChanges.hairColorId) ||
      (characterChanges.mixFaceColorId &&
        characterChanges.mixFaceColorId !== characterChanges.faceColorId)
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

  const handleReset = useCallback(() => {
    dispatch({
      type: UPDATE_CHARACTER,
      payload: {
        hairId: currentCharacter.selectedItems?.Hair?.id || '',
        faceId: currentCharacter.selectedItems?.Face?.id || '',
        mixHairColorId: currentCharacter.mixDye?.hairColorId || '',
        mixFaceColorId: currentCharacter.mixDye?.faceColorId || '',
      },
    })
  }, [currentCharacter])
  const handleSave = useCallback(() => {
    dispatch({ type: CHARACTER_UPDATE, payload: changedCharacter })
    dispatch({ type: CHARACTER_CHANGE, payload: changedCharacter.id })
  }, [changedCharacter])

  return (
    <Row style={{ maxWidth: 500, margin: '0 auto' }}>
      <Col flex="1 0 0">
        <CharacterImage characterData={currentCharacter} />
      </Col>
      <Col flex="80px">
        <div className="changearrow">&gt;</div>
      </Col>
      <Col flex="1 0 0">
        {changedCharacter.isChange ? (
          <CharacterImage characterData={changedCharacter} />
        ) : (
          <div>not_thing_change</div>
        )}
      </Col>
      <Col span={24}>
        <Row>
          <Col flex="1 0 0">
            <Button
              type="default"
              size="large"
              icon={<ReloadOutlined />}
              disabled={!changedCharacter.isChange}
              onClick={handleReset}
              block
            >
              Reset
            </Button>
          </Col>
          <Col flex="80px"></Col>
          <Col flex="1 0 0">
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              disabled={!changedCharacter.isChange}
              onClick={handleSave}
              block
            >
              Save
            </Button>
          </Col>
        </Row>
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
