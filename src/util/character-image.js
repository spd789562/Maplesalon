const { API_DATA_URL } = require('next/config').default().publicRuntimeConfig

const characterImage = function characterImage(character, dataInformation) {
  let itemEntries = Object.values(character.selectedItems)
    .filter((item) => item.id && (item.visible === undefined || item.visible))
    .map((item) => {
      let itemEntry = { itemId: Number(item.id) }

      if (
        (item.id >= 20000 && item.id < 30000) ||
        (item.id >= 1010000 && item.id < 1020000)
      )
        itemEntry.animationName = character.emotion
      if (item.region && item.region.toLowerCase() != 'gms')
        itemEntry.region = item.region
      if (item.version && item.version.toLowerCase() != 'latest')
        itemEntry.version = item.version
      // ignore other property
      //  if (item.hue) itemEntry.hue = item.hue
      //  if (item.saturation != 1) itemEntry.saturation = item.saturation
      //  if (item.contrast != 1) itemEntry.contrast = item.contrast
      //  if (item.brightness != 1) itemEntry.brightness = item.brightness
      //  if (item.alpha != 1) itemEntry.alpha = item.alpha
      // keep transformation
      if (item.islot) itemEntry.islot = item.islot
      if (item.vslot) itemEntry.vslot = item.vslot

      return itemEntry
    })
  let itemEntriesPayload = JSON.stringify([
    ...itemEntries,
    // {
    //   itemId: Number(character.skin),
    //   region: dataInformation.region,
    //   version: dataInformation.version,
    // },
    // {
    //   itemId: Number(character.skin) + 10000,
    //   region: dataInformation.region,
    //   version: dataInformation.version,
    // },
  ])
  itemEntriesPayload = encodeURIComponent(
    itemEntriesPayload.substr(1, itemEntriesPayload.length - 2)
  )

  return `${API_DATA_URL}/api/character/${itemEntriesPayload}/${
    character.action || 'stand1'
  }/${
    character.animating ? 'animated' : character.frame || '0'
  }?showears=${!!character.mercEars}&showLefEars=${!!character.illiumEars}&showHighLefEars=${!!character.highFloraEars}&resize=1&name=&flipX=${!!character.flipX}&renderMode=1`
}

export default characterImage
