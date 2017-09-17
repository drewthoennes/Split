const ffmpeg = require('fluent-ffmpeg'),
  fs = require('fs')

class Stream {
  constructor(id) {
    this.userId = id
    this.settings = {}
    fs.mkdir(__dirname + '/stream/' + this.userId)
  }
  prepare(path, callback) {
    if (this.ffmpeg) this.ffmpeg.kill()
    console.log('-filter:v "crop='
    + this.settings.width + ':'
    + this.settings.height + ':'
    + this.settings.x + ':'
    + this.settings.y + '"');
    this.ffmpeg = ffmpeg(__dirname + '/static/countdown.mp4', { timeout: 432000 }).addOptions([
      '-filter_complex crop='
      + this.settings.width + ':'
      + this.settings.height + ':'
      + this.settings.x + ':'
      + this.settings.y,
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
