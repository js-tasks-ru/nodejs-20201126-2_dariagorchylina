const url = require('url');
const {readFile} = require('fs');
const http = require('http');
const path = require('path');

const server = new http.Server();

server.on('request', async (req, res) => {
  const pathNames = url.parse(req.url).pathname;
  const pathname = pathNames.slice(1);
  const hasNestedFiles = pathNames.split('/').filter((i) => i.length).length > 1;
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      readFile(filepath, function(error, contents) {
        if (error && error.code === 'ENOENT' && hasNestedFiles) {
          res.statusCode = 400;
          res.end('Bad request');
          return;
        }

        if (error && error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }

        res.statusCode = 200;
        res.end(contents);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
