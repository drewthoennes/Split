const express = require('express'),
  app = express(),
  http = require('http').Server(app),
  // io = require('socket.io')(http),
  port = 8080,
  path = require('path'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  HLSServer = require('hls-server')

app.use(bodyParser.json())
app.use(morgan('dev'))



const RoomManager = require('./roomManager')
let rm = new RoomManager()

app.use('/api', rm.router)

const hls = new HLSServer(http, {
  path: '/stream',     // Base URI to output HLS streams
  dir: 'stream'  // Directory that input files are stored
})

http.listen(port, () => console.log('listening on port ' + port))
