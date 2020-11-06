import * as Omggif from 'omggif'
import { assoc } from 'ramda'

const isGif = (url) => !!url.match(/\/animated/)

const loadPng = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        image: img,
      })
    }
    img.onerror = () => {
      reject()
    }
    img.src = url
  })

const gifFrameToImage = (frame) => {
  const image = new ImageData(frame.pixels, frame.width, frame.height)
  const gifCanvas = document.createElement('canvas')
  gifCanvas.width = frame.width
  gifCanvas.height = frame.height
  gifCanvas.getContext('2d').putImageData(image, 0, 0)
  return gifCanvas
}

const loadGif = (url) =>
  new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.arrayBuffer())
      // .then((blob) => blob.arrayBuffer())
      .then((arrayBuffer) => {
        var reader = new Omggif.GifReader(new Uint8Array(arrayBuffer))
        const result = new Array(reader.numFrames())
          .fill('')
          .map((_, index) => {
            var frameInfo = reader.frameInfo(index)
            frameInfo.pixels = new Uint8ClampedArray(
              reader.width * reader.height * 4
            )
            reader.decodeAndBlitFrameRGBA(index, frameInfo.pixels)
            return frameInfo
          })
          .map((f) => assoc('image', gifFrameToImage(f), f))
        resolve({
          image: reader,
          frames: result,
        })
      })
      .catch(reject)
  })

const loadImage = (url) =>
  new Promise((resolve) => {
    let counter = 0,
      timer
    const getImage = isGif(url) ? loadGif : loadPng
    const imageLoader = () => {
      clearTimeout(timer)
      if (counter <= 3) {
        getImage(url)
          .then(resolve)
          .catch(() => {
            counter += 1
            if (counter < 3) timer = setTimeout(imageLoader, 2000)
          })
      } else {
        clearTimeout(timer)
        resolve(undefined)
      }
    }
    imageLoader()
  })

export default loadImage
