const NET = require('net');
const FS = require('fs');
const HTTPS = require('https');
const URL = require('url');
const QS = require('querystring');
const EXPRESS = require('express');
const APP = EXPRESS();

const HOSTNAME = '10.0.0.116';
const PORT = 8765;
var CONFIG;

function getConfig (callback) {
  FS.readFile('./config.json', 'utf8', (err, data) => {
    if(err) throw err;
    CONFIG = JSON.parse(data);
    callback();
  });
};

function logConfig() {
  console.log(CONFIG.slackUrl);
};

function postSlack() {
  var theUrl = URL.parse(CONFIG.slackUrl);
  var thePost = JSON.stringify({
    "text": "Mark's Testing"
  });
  var options = {
    "protocol": theUrl.protocol,
    "hostname": theUrl.host,
    "path": theUrl.path,
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Content-Length": thePost.length
    }
  }
  var req = HTTPS.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.')
    })
  });
  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  req.write(thePost);
  req.end();
};

getConfig(logConfig);

APP.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  postSlack();
  res.end('Hi World\n');
});

APP.listen(PORT, HOSTNAME, () => {
  console.log(`Listening on ${HOSTNAME}:${PORT}`);
});
