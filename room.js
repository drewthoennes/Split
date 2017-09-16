const express = require("express"),
  scailer = require('./scailer'),
  User = require('./user')

const STATUS = {
  WAITING_FOR_USERS: 1,
  WAITING_FOR_VIDEO_TO_DOWNLOAD: 2,
  PLAYING: 3,
  PAUSE: 4
}


class Room {
  constructor(id) {
    this.id = id
    // this.scailer = new scailer()
    this.users = []
    this.router = express.Router()
    this.time = 0
    this.status = STATUS.WAITING_FOR_USERS

    this.router.post('/join', (req, res) => {
      console.log(req.body);
      if (req.body.width && req.body.height && req.body.resolution) {
        let id = this.newUser(req.body)
        res.json({
          id: id,
          success: true
        })
      } else {
        res.json({
          success: false,
          error: 'Not enough data'
        })
      }
    })

    this.router.post('/download', (req, res) => {
      if (req.body.url) {
        this.download(req.body.url)
        this.json({
          success: true
        })
      } else {
        this.json({
          success: false,
          error: 'Not enough data'
        })
      }
    })
  }
  newUser(conf) {
    let user = new User(conf.width, conf.height, conf.resolution)
    this.users.push(user)
    // this.scailer.add(user.info(), (data) => this.updateDimentions(data))
    this.useVideo('./static/countdown.mp4')
  }
  updateDimentions(data) {
    data.forEach((e) => {
      this.users.forEach((u) => {
        if (u.id === e.id) u.applySize(e)
      })
    })
  }
  download(url) {
  }
  useVideo(path) {
    this.users.forEach(e => e.prepareVideo(path))
  }
  info() {
    return {
      id: this.id,
      users: this.users.length
    }
  }
}

module.exports = Room
