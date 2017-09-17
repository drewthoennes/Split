const Room = require('./room'),
  randomstring = require('randomstring'),
  express = require("express")


var router = express.Router();

class RoomManager {
  constructor(io) {
    this.rooms = []
    this.router = express.Router()
    this.io = io

    this.router.get('/rooms/create', (req, res) => {
      res.json({
        id: this.createRoom(),
        success: true
      })
    })

    this.router.get('/rooms/list', (req, res) => {
      res.json(this.list())
    })

    this.io.on('connection', (socket) => {
      socket.on('createRoom', () => {
        this.io.to(socket.id).emit('roomCreated', this.createRoom())
      })
    })
  }
  createRoom() {
    let id = randomstring.generate({
      length: 4,
      charset: 'alphabetic',
      capitalization: 'lowercase'
    })
    let room = new Room(id, this.io)
    this.router.use('/room/' + id, room.router)
    this.rooms.push(room)
    console.log('Created new room ' + id)
    return id
  }
  list() {
    let list = []
    this.rooms.forEach((e) => {
      list.push(e.info())
    })
    return list
  }
}

module.exports = RoomManager
