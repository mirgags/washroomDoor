const NET = require('net');
const FS = require('fs');
const HTTPS = require('https');
const URL = require('url');
const QS = require('querystring');
const EXPRESS = require('express');
const APP = EXPRESS();

/* Set the server environment */

const HOSTNAME = '10.0.0.116';
const PORT = 8765;

/* Initialize a global variable for the configuration */

var CONFIG;

/* Async File Read to get configuration */

function getConfig (callback) {
  FS.readFile('./config.json', 'utf8', (err, data) => {
    if(err) throw err;
    CONFIG = JSON.parse(data);
    callback();
  });
};

/* Wrapped for testing within callbacks */

function logConfig() {
  console.log(CONFIG.slackUrl);
};

/* Receives a stringified JSON object (maybe I should pass a JSON
   object instead) in the format required by Slack
   and a callback parameter */

function postSlack(thePost, callback) {
  var theUrl = URL.parse(CONFIG.slackUrl);

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
  callback();
  req.write(thePost);
  req.end();
};

/* Writes the state to the configuration object stored in a local file,
   this could be substitued for a DB in the future */

function writeConfig() {
  FS.writeFile('config.json', JSON.stringify(CONFIG, null, 2), (err) => {
  if (err) throw err;
    console.log('It\'s saved!');
  });
};

getConfig(logConfig);

APP.get('/', (req, res) => {
  var slackText = ""; 
  var reqUrl = URL.parse(req.url);
/*  console.log(reqUrl); */
  var reqQuery = QS.parse(reqUrl.query);
/*  console.log(reqQuery); */

  var slackPost = {
    "username": "BathroomBot",
    "attachments": [{
      "color": "#000000",
      "text": "",
      "fallback": "",
      "author_name": "Mark's PoopBot",
      "author_icon": ":poop:"
    }]
  };

  switch (reqQuery.value1) {
    case "ESP_TEST":
      slackPost.attachments[0].text += "1st Floor North Washroom is ";
      CONFIG.bathroomKeys.br1a = reqQuery.value3;
      break;
    case "ESP_TEST2":
      slackPost.attachments[0].text += "1st Floor South Washroom is ";
      CONFIG.bathroomKeys.br1b = reqQuery.value3;
      break;
    case "ESP_TEST3":
      slackPost.attachments[0].text += "2nd Floor Washroom is ";
      CONFIG.bathroomKeys.br2 = reqQuery.value3;
      break;
    default:
      console.log("no cases found");
  };
  slackPost.attachments[0].text += reqQuery.value3;
  slackPost.attachments[0].fallback = slackPost.attachments.text;
  switch (reqQuery.value3) {
    case "occupied":
      slackPost.attachments[0].color = "#FF0000";
      break;
    case "vacant":
      slackPost.attachments[0].color = "#00FF00";
      break;
    default:
      slackPost.attachments[0].color = "#BBBBBB";
      break;
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  postSlack(JSON.stringify(slackPost), writeConfig);
  console.log(JSON.stringify(CONFIG.bathroomKeys));
  res.end('Thanks, little node mcu!\n');
});


APP.listen(PORT, HOSTNAME, () => {
  console.log(`Listening on ${HOSTNAME}:${PORT}`);
});
