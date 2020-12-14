const url = require('url');
const {createReadStream} = require('fs');
const http = require('http');
const path = require('path');

const server = new http.Server();

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const hasNestedFiles = pathname.split('/').filter((i) => i.length).length > 1;
  const filepath = path.join(__dirname, 'files', pathname);
  const readStream = createReadStream(filepath);

  switch (req.method) {
    case 'GET':

      readStream.on('data', (data) => {
        if (!data) {
          res.statusCode = 201;
          res.end('Successfully done');
        }
      });

      readStream.on('error', (error) => {
        if (hasNestedFiles) {
          res.statusCode = 400;
          res.end('Bad request');
          return;
        }

        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Not found');
        }
      });

      readStream.pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
