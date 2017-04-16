const objects = require('./data/object.json')
const periods = require('./data/period.json')
const visionTags = require('./data/cloud-vision.json')
const galleries = require('./data/gallery.json')

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
      return objects[id]
    },
    gallery (_, { number }) {
      const gallery = galleries[number]
      if (gallery) return Object.assign({ number }, galleries[number])
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
        return Object.assign({ number }, galleries[number])
      }
    }
  },
  Gallery: {
    objects (root) {
      return root.objects.map((id) => objects[id])
    }
  },
  Tag: {
    objects ({ description }) {
      return Object.keys(visionTags)
        .filter((id) => visionTags[id].includes(description))
        .map((id) => objects[id])
    }
  }
}
