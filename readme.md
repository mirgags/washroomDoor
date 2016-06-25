# Server for nodeMCU door sensors

## Dependencies:
node: ^4.4.5
npm: ^3.9.6
express: ^4.14.0

* Pull and run npm install express (should be enough)
* Create a config.json file like this:
    {
      "slackUrl": "https://{{yourSlackEndpoint}}",
      "bathroomKeys": {
        "br1a": "vacant",
        "br1b": "vacant",
        "br2": "vacant"
      }
    }
* Format nodeMCU urls like this: http://{{yourHost}}/?value1=ESP_TEST&value2=2ndFloorB&value3=vacant 
