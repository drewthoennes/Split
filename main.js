const express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  port = 8080,
  path = require('path'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  HLSServer = require('hls-server'),
  cors = require('cors')


app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())

io.on('connection', function(socket){
  console.log('New connection');
  socket.on('echo', (m) => {
    console.log(m)
  })
})

const RoomManager = require('./roomManager')
let rm = new RoomManager(io)


// const hls = new HLSServer(http, {
//   path: '/stream',     // Base URI to output HLS streams
//   dir: 'stream'  // Directory that input files are stored
// })

app.use('/api', rm.router)
app.use('/stream', express.static('stream'))

http.listen(port, () => console.log('listening on port ' + port))
