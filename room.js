const express = require("express"),
  scailer = require('./scailer'),
  User = require('./user'),
  io = require('socket.io'),
  youtubedl = require('youtube-dl'),
  fs = require('fs')

const STATES = {
  WAITING_FOR_USERS: 1,
  WAITING_FOR_VIDEO_TO_DOWNLOAD: 2,
  PLAYING: 3,
  PAUSE: 4
}

class Room {
  constructor(id, io) {
    this.id = id
    this.scailer = new scailer()
    this.users = []
    this.router = express.Router()
    this.time = 0
    // this.status = STATUS.WAITING_FOR_USERS
    this.io = io

    this.router.post('/join', (req, res) => {
      console.log(req.body);
      if (req.body.width && req.body.height && req.body.xdpi && req.body.ydpi) {
        let id = this.newUser(req.body)
        res.json({id: id, success: true})
      } else {
        res.json({success: false, error: 'Not enough data'})
      }
    })

    this.router.post('/download', (req, res) => {
      if (req.body.url) {
        this.download(req.body.url)
        this.json({success: true})
      } else {
        this.json({success: false, error: 'Not enough data'})
      }
    })

    this.nsp = this.io.of(`/${this.id}`)
    this.nsp.on('connection', (socket) => {
      console.log(`New socket connection in room ${this.id}`)
      socket.on('join', (data) => {
        console.log('New join', data)
        if (data.width && data.height && data.xdpi && data.ydpi) {
          let id = this.newUser(data)
          this.nsp.to(socket.id).emit('joinAccepted', id)
        }
      })

      socket.on('prepare', (name) => {
        if (name == 'youtube') {
          this.useVideo(__dirname + '/static/yt.mp4')
        } else {
          this.useVideo(__dirname + '/static/countdown.mp4')
        }
        setTimeout(() => {
          this.nsp.emit('prepare')
          setTimeout(() => {
            this.nsp.emit('play')
          }, 5000)
        }, 5000)
      })

      socket.on('download', (url) => {
        this.download(url)
      })
    })

  }
  newUser(conf) {
    let user = new User(conf.width, conf.height, conf.xdpi, conf.ydpi)
    this.users.push(user)
    this.nsp.emit('usersCount', this.users.length.toString())
    return user.id
    // this.scailer.add(user.info())
    // this.useVideo('./static/countdown.mp4')
  }
  updateDimentions(data) {
    // data.forEach((e) => {
    //   this.users.forEach((u) => {
    //     if (u.id === e.id) u.applySize(e)
    //   })
    // })
  }
  download(url) {
    console.log("Downloading yt video", url);
    let video = youtubedl(url, ['-f best[height<=480, ext=mp4]'])
    video.pipe(fs.createWriteStream('static/yt.mp4'))
  }
  useVideo(path) {
    console.log(this.users)
    this.scailer.setVideoSize(1280, 720)
    this.scailer.calculate(this.users, () => {
      this.users.forEach(e => e.prepareVideo(path))
    })
  }
  info() {
    return {id: this.id, users: this.users.length}
  }
}

module.exports = Room
