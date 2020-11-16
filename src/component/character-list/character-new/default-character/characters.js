import AdventurerMale from './character-data/Adventurer-male.json'
import AdventurerFemale from './character-data/Adventurer-female.json'
import Mercedes from './character-data/Mercedes.json'
import Adele from './character-data/Adele.json'
import DarkSuit from './character-data/Dark-suit.json'
import Halloween from './character-data/Halloween.json'
import Kirito from './character-data/Kirito.json'
import Miku from './character-data/Miku.json'
import ThunderBreaker from './character-data/Thunder-Breaker.json'

export default [
  // {
  //   title: 'default_character_basic',
  //   list: [
  //     {
  //       id: 1001,
  //       type: 'character',
  //       action: 'stand1',
  //       emotion: 'default',
  //       skin: 2000,
  //       zoom: 1,
  //       frame: 0,
  //       mercEars: false,
  //       illiumEars: false,
  //       selectedItems: {
  //         Body: {
  //           name: 'Body',
  //           noIcon: true,
  //           id: 2000,
  //           region: 'GMS',
  //           version: '217',
  //         },
  //         Head: {
  //           name: 'Head',
  //           noIcon: true,
  //           id: 12000,
  //           region: 'GMS',
  //           version: '217',
  //         },
  //       },
  //       name: 'Basic',
  //     },
  //     {
  //       id: 1002,
  //       type: 'character',
  //       action: 'stand1',
  //       emotion: 'default',
  //       skin: 2001,
  //       zoom: 1,
  //       frame: 0,
  //       mercEars: false,
  //       illiumEars: false,
  //       selectedItems: {
  //         Body: {
  //           name: 'Body',
  //           noIcon: true,
  //           id: 2001,
  //           region: 'GMS',
  //           version: '217',
  //         },
  //         Head: {
  //           name: 'Head',
  //           noIcon: true,
  //           id: 12001,
  //           region: 'GMS',
  //           version: '217',
  //         },
  //       },
  //       name: 'Basic',
  //     },
  //   ],
  // },
  {
    title: 'default_character_other',
    list: [
      {
        id: 1001,
        type: 'character',
        action: 'stand1',
        emotion: 'default',
        skin: 2000,
        zoom: 1,
        frame: 0,
        mercEars: false,
        illiumEars: false,
        selectedItems: {
          Body: {
            name: 'Body',
            noIcon: true,
            id: 2000,
            region: 'GMS',
            version: '217',
          },
          Head: {
            name: 'Head',
            noIcon: true,
            id: 12000,
            region: 'GMS',
            version: '217',
          },
        },
        name: 'Basic',
      },
      AdventurerMale,
      AdventurerFemale,
      ThunderBreaker,
      Mercedes,
      Adele,
      DarkSuit,
      Halloween,
      Kirito,
      Miku,
    ],
  },
]
