const Stream = require('./stream'),
  uuid = require('uuid/v1')

class User {
  constructor(width, height, resolution) {
    this.displaySpecs = {
      width: width,
      height: height,
      resolution: resolution
    }
    this.id = uuid()
    this.streamSpecs = {}

    this.stream = new Stream(this.id)
    return id
  }
  prepareVideo(path) {
    this.stream.prepare(path, () => console.log('Finished'))
  }
}

module.exports = User
