const copyTextToClipboard = (text) => {
  const isIOS = navigator.userAgent.match(/ipad|iphone/i)

  var textArea = document.createElement('textarea')
  textArea.style.position = 'fixed'
  textArea.style.top = 0
  textArea.style.left = 0
  textArea.style.width = '1rem'
  textArea.style.height = '1rem'
  textArea.style.padding = 0
  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'
  textArea.style.backgroundColor = 'transparent'
  textArea.value = text
  document.body.appendChild(textArea)
  if (isIOS) {
    textArea.readOnly = true
    let range = document.createRange()
    range.selectNodeContents(textArea)
    let selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    textArea.setSelectionRange(0, 999999)
  } else {
    textArea.focus()
    textArea.select()
  }

  try {
    var successful = document.execCommand('copy')
  } catch (err) {}

  document.body.removeChild(textArea)
}

export default copyTextToClipboard
