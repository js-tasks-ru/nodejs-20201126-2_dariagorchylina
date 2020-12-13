const url = require('url');
const http = require('http');
const path = require('path');
const {unlink} = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const hasNestedFiles = pathname.split('/').filter((i) => i.length).length > 1;
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':

      if (hasNestedFiles) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }

      unlink(filepath, (err) => {
        if (err && err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File not found');
          return;
        }

        if (!err) {
          res.statusCode = 200;
          res.end('Successfully done');
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
