const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #limit = 0;
  #sumOfChunks= 0;
  constructor(options) {
    super(options);
    this.#limit = options.limit
  }

  _transform(chunk, encoding, callback) {
    let error;
    this.#sumOfChunks += chunk.length;
    if (this.#sumOfChunks > this.#limit) {
      error = new LimitExceededError()
      callback(error);
    } else {
      callback(error, chunk);
    }
  }
}

module.exports = LimitSizeStream;
