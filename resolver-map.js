const data = require('./data/raw.json')
const periods = require('./data/period.json')
const visionTags = require('./data/cloud-vision.json')

const titleFields = [
  'Title 1',
  'Title 2',
  'Title 3',
  'Title 4'
]

const locations = {
  'Rodin Museum': {
    galleries: [
      'Main Gallery',
      'West Gallery',
      'East Gallery',
      'North Gallery',
      'Northwest Gallery',
      'Visitor Center Foyer',
      'Northeast Gallery',
      'Exit Foyer',
      'Parkway'
    ]
  },
  'Philadelphia Museum of Art': {
    floors: {
      1: {
        sections: [
          'European Art 1850-1900',
          'American Art',
          'Prints, Drawings, and Photographs',
          'Modern and Contemporary Art'
        ]
      },
      2: {
        sections: [
          'European Art 1500-1850',
          'Asian Art',
          'American Art',
          'Costume and Textiles',
          'European Art 1100-1500',
          'Arms and Armor'
        ]
      }
    }
  }
}

module.exports = {
  Query: {
    object (_, { id }) {
      return data.find((object) => {
        return object['ObjectID'] === String(id)
      })
    },
    gallery (_, { number }) {
      const objects = filterByGalleryString(`Gallery ${number}`)
      if (objects.length !== 0) {
        return { number, objects }
      }
    },
    location (_, { name }) {
      return Object.keys(locations).map((name) => ({ name }))
    },
    tag (_, args) {
      return args
    }
  },
  Object: {
    id (object) { return object['ObjectID'] },
    titles (object) { return titleFields.map((field) => object[field]).filter((title) => title) },
    fullImageURL (object) { return `https://s3.amazonaws.com/pma-media/Full+Res/${object['Image Filename']}` },
    tumbnailImageURL (object) { return `https://s3.amazonaws.com/pma-media/Thumbnails/${object['Image Filename']}` },
    period (object) { return periods[object['Period']] },
    tags (object) { return visionTags[object['ObjectID']].map((description) => ({ description })) },
    gallery (object) {
      const galleryStr = object['Gallery Location']
      if (galleryStr.startsWith('Gallery')) {
        const number = galleryStr.split(', ')[0].split(' ')[1]
        return { number }
      }
    }
  },
  Gallery: {
    objects ({number, objects}) {
      if (objects) return objects
      return filterByGalleryString(`Gallery ${number}`)
    }
  },
  Tag: {
    objects ({ description }) {
      return Object.keys(visionTags)
        .filter((id) => visionTags[id].includes(description))
        .map((id) => data.find((obj) => obj['ObjectID'] === id))
    }
  }
}

function filterByGalleryString (string) {
  return data.filter((obj) => obj['Gallery Location'] && obj['Gallery Location'].includes(string))
}
