cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-mqtt/www/MQTTEmitter.js",
        "id": "cordova-plugin-mqtt.MQTTEmitter",
        "pluginId": "cordova-plugin-mqtt",
        "clobbers": [
            "ME"
        ]
    },
    {
        "file": "plugins/cordova-plugin-mqtt/www/cordova-plugin-mqtt.js",
        "id": "cordova-plugin-mqtt.CordovaMqTTPlugin",
        "pluginId": "cordova-plugin-mqtt",
        "clobbers": [
            "cordova.plugins.CordovaMqTTPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-speechrecognition/www/speechRecognition.js",
        "id": "cordova-plugin-speechrecognition.SpeechRecognition",
        "pluginId": "cordova-plugin-speechrecognition",
        "merges": [
            "window.plugins.speechRecognition"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-mqtt": "0.3.8",
    "cordova-plugin-speechrecognition": "1.1.2",
    "cordova-plugin-whitelist": "1.3.3"
}
// BOTTOM OF METADATA
});