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

      if (hasNestedFiles) {
        res.statusCode = 400;
        res.end('Bad request');
      }

      readFile(filepath, function(err, contents) {
        if (!contents) {
          res.statusCode = 404;
          res.end('Not found');
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
