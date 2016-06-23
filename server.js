const NET = require('net');
const HTTP = require('http');

const HOSTNAME = '192.168.200.20';
const PORT = 8765;

/*
var server = net.createServer(function(socket) {
    socket.write('Echo server\r\n');
    socket.pipe(socket);
});
*/

var server = HTTP.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hi World\n');
});

server.listen(PORT, HOSTNAME);
