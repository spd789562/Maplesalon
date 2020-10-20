import { useMemo, memo } from 'react'

import { useStore } from '@store'

import characterImage from '@utils/character-image'
import { formatHairId } from '@utils/group-hair'
import { clone, isEmpty } from 'ramda'

const CharacterImage = ({ characterData }) => {
  const [regionData] = useStore('meta.region', {})
  const { character, mixedCharacter, opacity } = useMemo(() => {
    let mixedCharacter
    let opacity = 1
    const hasCharacter = !isEmpty(characterData)
    if (hasCharacter && characterData.mixDye) {
      const copyCharacter = clone(characterData)
      copyCharacter.selectedItems.Hair.id =
        formatHairId(characterData.selectedItems.Hair.id) * 10 +
        +characterData.mixDye.hairColorId
      mixedCharacter = characterImage(copyCharacter, regionData)
      opacity = characterData.mixDye.hairOpacity
    }
    return {
      character: hasCharacter ? characterImage(characterData, regionData) : '',
      mixedCharacter,
      opacity,
    }
  }, [characterData])
  return (
    <div className="character-container">
      <div
        className="character-container-image"
        key={character}
        style={{
          backgroundImage: `url(${character})`,
        }}
      />
      {mixedCharacter && (
        <div
          className="character-container-image"
          key={mixedCharacter}
          style={{
            backgroundImage: `url(${mixedCharacter})`,
            opacity,
          }}
        />
      )}
      <style jsx>{`
        .character-container {
          position: relative;
          width: 100%;
          height: 100%;
          padding-bottom: 150%;
        }
        .character-container-image {
          background-repeat: no-repeat;
          background-position: center;
          position: absolute;
          top: 0;
          left: 0;
          background-size: 80%;
          display: block;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}

export default CharacterImage
