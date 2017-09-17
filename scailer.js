
class Scailer {
  constructor() {

  }
  setVideoSize(width, height) {
    this.width = width
    this.height = height
  }
  calculate(users, cb) {
    let minHeight = 100000000, totalWidth = 0
    users.forEach((e) => {
      totalWidth += e.display.widthIn
      minHeight = Math.min(e.display.height, minHeight)
    })

    let scale = minHeight / this.height

    users.forEach((e, i) => {
      let x = 0
      for (var n = 0; n < i; n++) x += this.width * users[n].display.widthIn / totalWidth

      let x2 = 0
      for (var n = 0; n < i + 1; n++) x2 += this.width * users[n].display.widthIn / totalWidth

      let y = 0

      e.stream.settings.width = x2 - x
      e.stream.settings.height = this.width/16*9//this.height * scale
      e.stream.settings.x = x
      e.stream.settings.y = y
    })
    cb()
  }
}

module.exports = Scailer
