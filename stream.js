const ffmpeg = require('fluent-ffmpeg'),
  fs = require('fs')

class Stream {
  constructor(id) {
    this.userId = id
  }
  prepare(path, callback) {
    if (this.ffmpeg) this.ffmpeg.kill()
    fs.mkdir(__dirname + '/stream/' + this.userId)
    this.ffmpeg = ffmpeg(__dirname + '/static/countdown.mp4', { timeout: 432000 }).addOptions([
      '-profile:v baseline',
      '-level 3.0',
      '-s 640x360',
      '-start_number 0',
      '-hls_time 10',
      '-hls_list_size 0',
      '-f hls'
    ]).output('./stream/' + this.userId + '/output.m3u8').on('end', callback).run()
  }
}

module.exports = Stream
