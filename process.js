const fs = require('fs-extra-promise')
const JSONStream = require('JSONStream')
// const v = require('voca')

const stream = fs.createReadStream('./data/raw.json').pipe(JSONStream.parse('*'))

const data = { object: {} }

function processKey (obj, key, fn) {
  const str = obj[key]
  if (str) {
    fn(str)
  }
}

const sections = [
  'European Art 1500-1850',
  'Asian Art',
  'European Art 1850-1900',
  'American Art',
  'Costume and Textiles',
  'European Art 1100-1500',
  'Arms and Armor',
  'Main Gallery',
  'Prints, Drawings, and Photographs',
  'Modern and Contemporary Art'
]

stream.on('data', (obj) => {
  // extract ID
  const id = parseInt(obj['ObjectID'], 10)

  addToCollection('object', id, obj)

  if (obj['Latitude']) { data.object[id].latitude = parseFloat(obj['Latitude']) }
  if (obj['Longitude']) { data.object[id].latitude = parseFloat(obj['Longitude']) }

  processKey(obj, 'Artist 1', processArtist)
  processKey(obj, 'Artist 2', processArtist)
  processKey(obj, 'Artist 3', processArtist)
  processKey(obj, 'Artist 4', processArtist)
  processKey(obj, 'Artist 5', processArtist)
  processKey(obj, 'Artist 6', processArtist)
  processKey(obj, 'Artist 7', processArtist)

  processKey(obj, 'Title 1', processTitle)
  processKey(obj, 'Title 2', processTitle)
  processKey(obj, 'Title 3', processTitle)
  processKey(obj, 'Title 4', processTitle)

  processKey(obj, 'Classification', (str) => {
    addToCollection('classification', str, id)
    data.object[id].classification = str
  })

  processKey(obj, 'Dynasty', (raw) => {
    addToCollection('dynasty', raw, {})
  })

  processKey(obj, 'Period', (raw) => {
    let start, end, name

    const dateRangeMatch = raw.match(/\((.*)\)$/)
    if (dateRangeMatch) {
      const dates = dateRangeMatch[1].split('-')
      start = dates[0]
      end = dates[1]
    }

    name = raw.split(' (')[0].replace(' Period', '')

    addToCollection('period', raw, {
      start,
      end,
      name
    })
  })

  processKey(obj, 'Reign', (raw) => {
    addToCollection('reign', raw, {})
  })

  processKey(obj, 'Style', (raw) => {
    addToCollection('style', raw, {})
  })

  processKey(obj, 'Movement', (raw) => {
    addToCollection('movement', raw, {})
  })

  processKey(obj, 'School', (raw) => {
    addToCollection('school', raw, {})
  })

  processKey(obj, 'Geography', (raw) => {
    addToCollection('geography', raw, {})
  })

  processKey(obj, 'Gallery Location', (raw) => {
    if (raw.includes('Rodin')) {
      const [ location, section ] = raw.split(', ')
      addToCollection('location', location, { sections: [ section ] })
      addToCollection('section', section, { objects: [ id ] })
    }

    if (raw.startsWith('Gallery')) {
      const [ gallery ] = raw.split(', ')
      const galleryId = gallery.split(' ')[1]

      const section = sections.find((section) => raw.match(section))
      const floor = raw.match(/first floor/) ? 1 : 2

      const nameMatch = raw.match(/\((.*)\)$/)
      if (nameMatch) { addToCollection('gallery', galleryId, { name: nameMatch[1] }) }

      addToCollection('gallery', galleryId, { objects: [ id ] })
      addToCollection('section', section, { galleries: [ galleryId ] })
      addToCollection('floor', floor, { sections: [ section ] })
    }
  })

  function processTitle (str) {
    addToCollection('object', id, {
      titles: [ str ]
    })
  }

  function processArtist (str) {
    addToCollection('object', id, {
      artists: [ str ]
    })
  }
})

stream.on('end', () => {
  console.log(Object.keys(data.section))
  Object.keys(data).map((key) => fs.writeJSONAsync(`./data/${key}.json`, data[key]))
})

function addToCollection (collection, id, obj) {
  if (!data[collection]) { data[collection] = {} }
  if (!data[collection][id]) { data[collection][id] = {} }

  Object.keys(obj).map((key) => {
    if (Array.isArray(obj[key])) {
      if (!data[collection][id][key]) { data[collection][id][key] = [] }
      obj[key].forEach((val) => {
        if (data[collection][id][key].indexOf(val) === -1) {
          data[collection][id][key].push(val)
        }
      })
    } else {
      if (obj[key]) { data[collection][id][key] = obj[key] }
    }
  })
}

  // "Date": "c. 1759",
  // "Date Search Begin": "1754",
  // "Date Search End": "1764",
  // "Medium": "Hard-paste porcelain with enamel and gilt decoration",
  // "Materials": "enamel, hard paste porcelain",
  // "Techniques": "gilding",
  // "Support": "",
  // "Dimensions": "Height: 5 7\/8 inches (14.9 cm)",
  // "Dimension Type": "Overall",
  // "Dimension 1": "5.88",
  // "Dimension 2": "",
  // "Dimension 3": "",
  // "Credit Line": "The Bloomfield Moore Collection, 1882",
  // "Gallery Label": ""
