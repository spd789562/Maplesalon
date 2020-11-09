import { clone, pick, pipe, evolve, ifElse, identity, map } from 'ramda'

const getShareUrl = function getShareUrl(character) {
  const path = `${location.origin}/share?character=`
  const necessityDataQuery = pipe(
    clone,
    pick([
      'name',
      'skin',
      'selectedItems',
      'mercEars',
      'illiumEars',
      'highFloraEars',
      'mixDye',
    ]),
    evolve({
      mercEars: ifElse(identity, identity, () => undefined),
      illiumEars: ifElse(identity, identity, () => undefined),
      highFloraEars: ifElse(identity, identity, () => undefined),
      selectedItems: map(pick(['id', 'region', 'version'])),
    }),
    JSON.stringify,
    window.encodeURIComponent
  )(character)

  return path + necessityDataQuery
}

export default getShareUrl
