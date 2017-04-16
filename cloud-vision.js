const fs = require('fs-extra-promise')
const Promise = require('bluebird')
const vision = require('@google-cloud/vision')({
  keyFilename: './gcp.json'
})

const data = require('./data/raw')
const results = require('./data/cloud-vision.json')
const s3Bucket = 'https://s3.amazonaws.com/pma-media/Full+Res/'

const promises = Promise.map(data, (obj) => {
  const { 'ObjectID': id, 'Image Filename': filename } = obj
  if (!results[id]) {
    return vision.detectLabels(s3Bucket + filename, { verbose: true })
    .then((res) => {
      console.log(res[0])
      results[id] = res[0]
    })
    .catch((e) => console.log('ERROR', e))
  } else {
    return Promise.resolve()
  }
}, { concurrency: 10 })

Promise.all(promises).then(() => fs.writeJSONAsync('./data/cloud-vision.json', results))
