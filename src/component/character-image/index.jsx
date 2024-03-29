import { useMemo, useRef, useState, useEffect } from 'react'

import { useStore } from '@store'

import characterImage from '@utils/character-image'
import { formatHairId, getHairColorId } from '@utils/group-hair'
import { changeFaceColorId, getFaceColorId } from '@utils/group-face'
import transparentifyCharacter from '@utils/transparentify-character'
import loadImage from '@utils/load-image'
import { clone, isEmpty, isNil, identity } from 'ramda'
import Promise from 'bluebird'

Promise.config({
  cancellation: true,
})

const notEmpty = (str) => str !== '' && str !== undefined

const renderCharacter = (
  canvas,
  images,
  { frame = 0, mixedCharacter, hairOpacity, faceOpacity, resize = 0.8 }
) => {
  images.forEach(({ image, frames }, index) => {
    const ctx = canvas.getContext('2d')
    const imageRatio = image.height / image.width
    const _image = frames ? frames[frame].image : image
    let renderHeight, renderWidth
    if (resize.toString().includes('origin')) {
      const [, ratio = 1] = resize.split('-')
      const dpr = window.devicePixelRatio || 1
      renderHeight = image.height * +ratio * dpr
      renderWidth = image.width * +ratio * dpr
    } else {
      renderWidth = (canvas.height / imageRatio) * resize
      renderHeight = canvas.height * resize
    }
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
      _image,
      /* position */
      (canvas.width - renderWidth) / 2,
      (canvas.height - renderHeight) / 2,
      /* inside size */
      renderWidth,
      renderHeight
    )
    ctx.restore()
  })
}

const useCanvas = (square) => {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }
  }, [square])
  return canvasRef
}

const CharacterImage = ({ characterData, resize = 0.8, square }) => {
  const [regionData] = useStore('meta.region', {})
  const [isLoading, updateState] = useState(true)
  const canvasRef = useCanvas(square)
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
    const dataInformation = {
      ...regionData,
      square,
    }
    if (
      hasCharacter &&
      characterData.mixDye &&
      characterData.mixDye.hairColorId &&
      characterData.selectedItems.Hair &&
      getHairColorId(characterData.selectedItems.Hair?.id) !==
        +characterData.mixDye.hairColorId
    ) {
      const copyCharacter = clone(characterData)
      copyCharacter.selectedItems.Hair.id =
        formatHairId(characterData.selectedItems.Hair?.id) * 10 +
        +characterData.mixDye.hairColorId
      mixedCharacter = characterImage(copyCharacter, dataInformation)
      hairOpacity = characterData.mixDye.hairOpacity
    }
    if (
      hasCharacter &&
      characterData.mixDye &&
      characterData.mixDye.faceColorId &&
      characterData.selectedItems.Face &&
      getFaceColorId(characterData.selectedItems.Face?.id) !==
        +characterData.mixDye.faceColorId
    ) {
      const transparentCharacter = transparentifyCharacter(characterData)
      transparentCharacter.selectedItems.Face.id = changeFaceColorId(
        characterData.selectedItems.Face.id,
        characterData.mixDye.faceColorId
      )
      mixedFaceCharacter = characterImage(transparentCharacter, dataInformation)
      faceOpacity = characterData.mixDye.faceOpacity
    }
    return {
      character: hasCharacter
        ? characterImage(characterData, dataInformation)
        : '',
      mixedCharacter,
      mixedFaceCharacter,
      hairOpacity,
      faceOpacity,
    }
  }, [characterData, square])
  useEffect(() => {
    updateState(true)
    let _timer
    let _promise = {}
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cancelAnimationFrame(_timer)
    _promise = Promise.all(
      [character, mixedCharacter, mixedFaceCharacter]
        .filter(notEmpty)
        .map(loadImage)
    ).then((successes) => {
      if (successes.length && successes.every(identity)) {
        updateState(false)
        if (successes[0].frames) {
          let start = null
          let currentFrame = 0
          const frameCount = successes[0].frames.length
          const renderGif = (timestamp) => {
            const ms = timestamp - start
            const currentFrameDelay =
              successes[0].frames[currentFrame].delay * 10
            if (ms > currentFrameDelay || !start) {
              currentFrame =
                start && currentFrame + 1 < frameCount ? currentFrame + 1 : 0
              start = timestamp
              ctx.clearRect(0, 0, canvas.width, canvas.height)
              renderCharacter(canvas, successes, {
                frame: currentFrame,
                mixedCharacter,
                hairOpacity,
                faceOpacity,
                resize,
              })
            }
            _timer = requestAnimationFrame(renderGif)
          }
          _timer = requestAnimationFrame(renderGif)
        } else {
          renderCharacter(canvas, successes, {
            mixedCharacter,
            hairOpacity,
            faceOpacity,
            resize,
          })
        }
      } else {
        updateState(false)
      }
    })
    return () => {
      // cancel previous request prevent duplicate render
      _promise.cancel && _promise.cancel()
      const cancelAnimationFrame =
        window.cancelAnimationFrame || window.mozCancelAnimationFrame
      cancelAnimationFrame(_timer)
    }
  }, [
    character,
    mixedCharacter,
    mixedFaceCharacter,
    hairOpacity,
    faceOpacity,
    resize,
    square,
  ])

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
          padding-bottom: ${square ? '100%' : '150%'};
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
