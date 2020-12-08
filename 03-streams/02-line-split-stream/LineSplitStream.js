const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #currentEl='';
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const lines = (this.#currentEl + chunk.toString()).split(os.EOL);
    this.#currentEl = lines.pop();
    for (let line of lines) { this.push(line); }
    callback()
  }

  _flush(callback) {
    this.push(this.#currentEl != null ? this.#currentEl :"");
    callback();
  }
}

module.exports = LineSplitStream;
