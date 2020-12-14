const url = require('url');
const http = require('http');
const path = require('path');
const {createWriteStream, unlink} = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  const writeStream = createWriteStream(filepath, {flags: 'wx'});
  const limitedStream = new LimitSizeStream({limit: 10240});
  const removeFile = () => unlink(filepath, (err) => {
    if (err) throw err;
  });

  switch (req.method) {
    case 'POST':
      req.on('error', (error) => {
        res.statusCode = 500;
        res.end('Something went wrong');
      });

      req.once('aborted', () => {
        removeFile();
      });

      res.on('finish', () => {
        res.statusCode = 201;
        res.end('Successfully done');
      });

      writeStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File is already exist');
          return;
        }

        if (error.code === 'ENOENT') {
          res.statusCode = 400;
          res.end('Bad request');
          return;
        }

        res.statusCode = 500;
        res.end('Something went wrong');
      });

      limitedStream.on('error', () => {
        res.statusCode = 413;
        res.end('File is too big');
        removeFile();
      });

      req.pipe(limitedStream).pipe(writeStream);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
