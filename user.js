const Stream = require('./stream'),
  uuid = require('uuid/v1')

class User {
  constructor(width, height, xdpi, ydpi) {
    this.display = {
      width: width,
      height: height,
      xdpi: xdpi,
      ydpi: ydpi,
      widthIn: width/xdpi,
      heightIn: height/ydpi
    }

    this.id = uuid()
    this.streamSpecs = {}

    this.stream = new Stream(this.id)
  }
  prepareVideo(path) {
    this.stream.prepare(path, () => console.log('Finished'))
  }
  
}

module.exports = User
