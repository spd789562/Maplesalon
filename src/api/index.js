import getConfig from 'next/config'

const { API_DATA_URL } = getConfig().publicRuntimeConfig

const toJson = (d) => d.json()

export const APIGetWz = () =>
  fetch(`${API_DATA_URL}/api/wz`)
    .then(toJson)
    .then((data) =>
      data.reduce((allWz, wz) => {
        if (wz.isReady) {
          allWz[wz.region] = { region: wz.region, version: wz.mapleVersionId }
        }
        return allWz
      }, {})
    )

export const APIGetHair = ({ region, version }) =>
  fetch(
    `${API_DATA_URL}/api/${region}/${version}/item/?&categoryFilter=Character&overallCategoryFilter=Equip&subCategoryFilter=Hair`
  ).then(toJson)

export const APIGetFace = ({ region, version }) =>
  fetch(
    `${API_DATA_URL}/api/${region}/${version}/item/?&categoryFilter=Character&overallCategoryFilter=Equip&subCategoryFilter=Face`
  ).then(toJson)
