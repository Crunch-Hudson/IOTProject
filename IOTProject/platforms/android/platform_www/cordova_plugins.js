cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-mqtt.MQTTEmitter",
    "file": "plugins/cordova-plugin-mqtt/www/MQTTEmitter.js",
    "pluginId": "cordova-plugin-mqtt",
    "clobbers": [
      "ME"
    ]
  },
  {
    "id": "cordova-plugin-mqtt.CordovaMqTTPlugin",
    "file": "plugins/cordova-plugin-mqtt/www/cordova-plugin-mqtt.js",
    "pluginId": "cordova-plugin-mqtt",
    "clobbers": [
      "cordova.plugins.CordovaMqTTPlugin"
    ]
  },
  {
    "id": "cordova-plugin-speechrecognition.SpeechRecognition",
    "file": "plugins/cordova-plugin-speechrecognition/www/speechRecognition.js",
    "pluginId": "cordova-plugin-speechrecognition",
    "merges": [
      "window.plugins.speechRecognition"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-mqtt": "0.3.8",
  "cordova-plugin-speechrecognition": "1.1.2"
};
// BOTTOM OF METADATA
});