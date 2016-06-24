const NET = require('net');
const FS = require('fs');
const HTTPS = require('https');
const EXPRESS = require('express');
const APP = EXPRESS();

const HOSTNAME = '10.0.0.116';
const PORT = 8765;
var CONFIG;

function getConfig (callback) {
  FS.readFile('./config.json', 'utf8', (err, data) => {
    if(err) throw err;
    CONFIG = data.toString();
    callback();
  });
};

function logConfig() {
  console.log(CONFIG);
};

getConfig(logConfig);


/*
var server = net.createServer(function(socket) {
    socket.write('Echo server\r\n');
    socket.pipe(socket);
});
*/

APP.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hi World\n');
});

APP.listen(PORT, HOSTNAME, () => {
  console.log(`Listening on ${HOSTNAME}:${PORT}`);
});
