import { useMemo, useRef, useState, useEffect } from 'react'

import { useStore } from '@store'

import characterImage from '@utils/character-image'
import { formatHairId, getHairColorId } from '@utils/group-hair'
import {
  formatFaceId,
  changeFaceColorId,
  getFaceColorId,
} from '@utils/group-face'
import transparentifyCharacter from '@utils/transparentify-character'
import { clone, isEmpty, isNil, identity } from 'ramda'

const notEmpty = (str) => str !== '' && str !== undefined

const isImageLoading = (url) =>
  new Promise((resolve) => {
    let counter = 0,
      timer
    const loadImage = () => {
      if (counter <= 3) {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => {
          counter += 1
          setTimeout(loadImage, 500)
        }
        img.src = url
      } else {
        resolve(undefined)
      }
    }
    loadImage()
  })

const useCanvas = () => {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }
  }, [])
  return canvasRef
}

const CharacterImage = ({ characterData }) => {
  const [regionData] = useStore('meta.region', {})
  const [isLoading, updateState] = useState(true)
  const canvasRef = useCanvas()
  const {
    character,
    mixedCharacter,
    mixedFaceCharacter,
    hairOpacity,
    faceOpacity,
  } = useMemo(() => {
    let mixedCharacter
    let mixedFaceCharacter
    let hairOpacity = 1
    let faceOpacity = 1
    const hasCharacter =
      !isEmpty(characterData) && !isNil(characterData) && characterData.skin
    if (
      hasCharacter &&
      characterData.mixDye &&
      characterData.mixDye.hairColorId &&
      getHairColorId(characterData.selectedItems.Hair.id) !==
        +characterData.mixDye.hairColorId
    ) {
      const copyCharacter = clone(characterData)
      copyCharacter.selectedItems.Hair.id =
        formatHairId(characterData.selectedItems.Hair.id) * 10 +
        +characterData.mixDye.hairColorId
      mixedCharacter = characterImage(copyCharacter, regionData)
      hairOpacity = characterData.mixDye.hairOpacity
    }
    if (
      hasCharacter &&
      characterData.mixDye &&
      characterData.mixDye.faceColorId &&
      getFaceColorId(characterData.selectedItems.Face.id) !==
        +characterData.mixDye.faceColorId
    ) {
      const transparentCharacter = transparentifyCharacter(characterData)
      transparentCharacter.selectedItems.Face.id = changeFaceColorId(
        characterData.selectedItems.Face.id,
        characterData.mixDye.faceColorId
      )
      mixedFaceCharacter = characterImage(transparentCharacter, regionData)
      faceOpacity = characterData.mixDye.faceOpacity
    }
    return {
      character: hasCharacter ? characterImage(characterData, regionData) : '',
      mixedCharacter,
      mixedFaceCharacter,
      hairOpacity,
      faceOpacity,
    }
  }, [characterData])
  useEffect(() => {
    updateState(true)
    Promise.all(
      [character, mixedCharacter, mixedFaceCharacter]
        .filter(notEmpty)
        .map(isImageLoading)
    ).then((successes) => {
      if (successes.every(identity)) {
        updateState(false)
        successes.forEach((image, index) => {
          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          const imageRadio = image.height / image.width
          const resize = 0.8
          ctx.save()
          ctx.globalAlpha =
            index === 1
              ? mixedCharacter
                ? hairOpacity
                : faceOpacity
              : index === 2
              ? faceOpacity
              : 1
          ctx.drawImage(
            image,
            canvas.width / 2 - ((canvas.height / imageRadio) * resize) / 2,
            canvas.height / 2 - (canvas.height * resize) / 2,
            (canvas.height / imageRadio) * resize,
            canvas.height * resize
          )
          ctx.restore()
        })
      }
    })
  }, [character, mixedCharacter, mixedFaceCharacter])

  return (
    <div className="character-container">
      <canvas className="character-container-image" ref={canvasRef} />
      {isLoading && (
        <div
          className={`character-container-image character-container-image__loading`}
        />
      )}
      <style jsx>{`
        .character-container {
          position: relative;
          width: 100%;
          padding-bottom: 150%;
        }
        .character-container-image {
          background-repeat: no-repeat;
          position: absolute;
          top: 0;
          left: 0;
          background-size: auto 80%;
          background-position: center center;
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
