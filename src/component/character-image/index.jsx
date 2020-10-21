import { useMemo, memo, useState, useEffect } from 'react'

import { useStore } from '@store'

import characterImage from '@utils/character-image'
import { formatHairId } from '@utils/group-hair'
import { clone, isEmpty, identity } from 'ramda'

const notEmpty = (str) => str !== '' && str !== undefined

const isImageLoading = (url) =>
  new Promise((resolve) => {
    if (!url) {
      resolve(false)
      return
    }
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })

const CharacterImage = ({ characterData }) => {
  const [regionData] = useStore('meta.region', {})
  const [isLoading, updateState] = useState(true)
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
  useEffect(() => {
    updateState(true)
    Promise.all(
      [character, mixedCharacter].filter(notEmpty).map(isImageLoading)
    ).then((successes) => {
      if (successes.every(identity)) {
        updateState(false)
      }
    })
  }, [character, mixedCharacter])
  return (
    <div className="character-container">
      <div
        className={`character-container-image ${
          character && isLoading ? 'character-container-image__loading' : ''
        }`}
        key={character}
        style={
          character && !isLoading
            ? {
                backgroundImage: `url(${character})`,
              }
            : {}
        }
      />
      {mixedCharacter && (
        <div
          className={`character-container-image ${
            mixedCharacter && isLoading
              ? 'character-container-image__loading'
              : ''
          }`}
          key={mixedCharacter}
          style={
            mixedCharacter && !isLoading
              ? {
                  backgroundImage: `url(${mixedCharacter})`,
                  opacity,
                }
              : {}
          }
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
          text-align: center;
        }
        .character-container-image__loading::after {
          content: '';
          height: 100%;
          vertical-align: middle;
          display: inline-block;
        }
        .character-container-image__loading::before {
          content: '';
          width: 50px;
          height: 50px;
          border: 4px solid #999;
          border-left-color: transparent;
          border-radius: 50%;
          animation: loading linear infinite 1s;
          display: inline-block;
          vertical-align: middle;
          margin-left: auto;
          margin-right: auto;
        }
        @keyframes loading {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default CharacterImage
