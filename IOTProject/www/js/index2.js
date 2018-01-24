/*
index.js
*/
/**
 * TODO : Quand volet roulant installé
 *         -> Mettre à jour l'ESP8266 de la lampe du salon
 *            pour emettre/recevoir des messages sur le topic
 *            1floor/shutterEngine
 *         -> MAJ du javascript de l'appli pour prendre en compte les modifications
 *         -> Scénario NodeRed pour programmation d'ouverture/fermeture automatique du volet ?
 **/

var connect = false;
var relay1State = "1";
var relay2State = "1";
var relay3State = "1";
var myPayload = "1";
var available = false;
var recognition = null;
var subscribe = false;
var brokerAddr = "";
var brokerPort = "";

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
        //this.subscribeESPTopic();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        recognition = new SpeechRecognition();
        recognition.onresult = function (event) {
            if (event.results.length > 0) {
                var test1 = document.getElementById("speechButton");
                test1.innerHTML = event.results[0][0].transcript;
            }
        };
        // brokerAddr = window.localStorage.getItem("brokerAddress");
        // brokerPort = window.localStorage.getItem("port");
        // alert(brokerAddr+" "+brokerPort);
        // document.getElementById("brokerAddress").value = brokerAddr ? brokerAddr : "";
        // document.getElementById("port").value = brokerPort ? brokerPort : "";
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    },
    append: function (id, s) {
        // it is just a string append function. Nothing to do with the MQTT functions
        var node = document.createElement("p");                 // Create a <li> node
        var textnode = document.createTextNode(s);         // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>
        document.getElementById(id).appendChild(node);     // Append <li> to <ul> with id="myList"
    }
};

/* Connection management */
function startConnection() {
    if (document.getElementById("brokerAddress").value.substr(0, 6) != "tcp://")
        document.getElementById("brokerAddress").value = "tcp://" + document.getElementById("brokerAddress").value;
    window.cordova.plugins.CordovaMqTTPlugin.connect({
        url: document.getElementById("brokerAddress").value,
        port: document.getElementById("port").value,
        clientId: '',
        success: function (s) {
            connect = true;
            console.log(JSON.stringify(s));
            document.getElementById("Connect").style.display = "none";
            document.getElementById("Disconnect").style.display = "block";
            brokerAddr = document.getElementById("brokerAddress").value;
            brokerPort = document.getElementById("port").value;
            document.getElementById("connectionState").value = "Connected";
            ttsSpeak('Vous êtes maintenant connecté');
            window.localStorage.setItem("brokerAddress", document.getElementById("brokerAddress").value);
            window.localStorage.setItem("port", document.getElementById("port").value);
        },
        error: function (e) {
            connect = false;
            //document.getElementById("activity").innerHTML += "--> Error: something is wrong,\n "+JSON.stringify(e)+"<br>";
            document.getElementById("Connect").style.display = "block";
            document.getElementById("Disconnect").style.display = "none";
            document.getElementById("connectionState").value = "Disconnected";
            ttsSpeak('Echec de la connection au serveur');
            console.log(e);
        },
        onConnectionLost: function () {
            connect = false;
            //document.getElementById("activity").innerHTML += "--> You got disconnected";
            document.getElementById("Connect").style.display = "block";
            document.getElementById("Disconnect").style.display = "none";
        }
    });
}
function endConnection() {
    document.getElementById("Connect").style.display = "block";
    document.getElementById("Disconnect").style.display = "none";
    cordova.plugins.CordovaMqTTPlugin.disconnect({
        success: function (s) {
            connect = false;
            document.getElementById("Connect").style.display = "block";
            document.getElementById("Disconnect").style.display = "none";
            brokerAddr = "";
            brokerPort = "";
            document.getElementById("connectionState").value = "Disconnected";
            //document.getElementById("activity").innerHTML += "--> Success: you are now disconnected"+"<br>"
        },
        error: function (e) {
            //document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
            document.getElementById("Connect").style.display = "none";
            document.getElementById("Disconnect").style.display = "block";
            //alert("err!! something is wrong. check the console")
            console.log(e);
        }
    });
}
/**/

/* MQTT function */
function publishMessage() {
    if (!connect) {
        ttsSpeak('Vous devez être connecté au serveur pour utiliser cette fonctionnalité');
    } else {
        cordova.plugins.CordovaMqTTPlugin.publish({
            topic: document.getElementById("topic").value,
            payload: document.getElementById("message").value,
            qos: 0,
            retain: false,
            success: function (s) {
                //document.getElementById("activity").innerHTML += "--> Success: you have published to the topic, "+document.getElementById("topic_sub").value+"<br>";
            },
            error: function (e) {
                //document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                //alert("err!! something is wrong. check the console")
                console.log(e);
            }
        });
    }
}
function listenESPTopic() {
    if (subscribe == true) {
        cordova.plugins.CordovaMqTTPlugin.listen("esp1State", function (payload, params) {
            if (payload == "1") {
                // MAJ de l'UI pour ESP1
                document.getElementById("esp1_state").checked = true;
            }
            else {
                document.getElementById("esp1_state").checked = false;
            }
        });
        cordova.plugins.CordovaMqTTPlugin.listen("esp2State", function (payload, params) {
            if (payload == "1") {
                // MAJ de l'UI pour ESP2
                document.getElementById("esp2_state").checked = true;
            }
            else {
                document.getElementById("esp2_state").checked = false;
            }
        });
        cordova.plugins.CordovaMqTTPlugin.listen("esp3State", function (payload, params) {
            if (payload == "1") {
                // MAJ de l'UI pour ESP3
                document.getElementById("esp3_state").checked = true;
            }
            else {
                document.getElementById("esp3_state").checked = false;
            }
        });
    }
}
function subscribeESP1() {
    cordova.plugins.CordovaMqTTPlugin.subscribe({
        topic: "esp1State",
        qos: 0,
        success: function (s) {
            subscribe = true;
            listenESPTopic();
        },
        error: function (e) {
            ttsSpeak('Impossible de suivre ce topic');
        }
    });
}
function subscribeESP2() {
    cordova.plugins.CordovaMqTTPlugin.subscribe({
        topic: "esp2State",
        qos: 0,
        success: function (s) {
            subscribe = true;
            listenESPTopic();
        },
        error: function (e) {
            ttsSpeak('Impossible de suivre ce topic');
        }
    });
}
function subscribeESP3() {
    cordova.plugins.CordovaMqTTPlugin.subscribe({
        topic: "esp3State",
        qos: 0,
        success: function (s) {
            subscribe = true;
            listenESPTopic();
        },
        error: function (e) {
            ttsSpeak('Impossible de suivre ce topic');
        }
    });
}
/**/

/* Nearly deprecated */
function activateRelay1() {
    if (!connect) {
        ttsSpeak('Vous devez être connecté au serveur pour utiliser cette fonctionnalité');
        document.getElementById("esp1_state").checked = false;
    } else {
        if (relay1State == "1")
            myPayload = "2";
        else
            myPayload = "1";

        cordova.plugins.CordovaMqTTPlugin.publish({
            topic: "1floor/shutterEngineUp",
            payload: myPayload,
            qos: 0,
            retain: false,
            success: function (s) {
                if (relay1State == "1") {
                    relay1State = "2";
                    ttsSpeak('Bien compris, jouvre le volet du salon');
                    document.getElementById("esp1_state").checked = true;
                } else {
                    relay1State = "1";
                    ttsSpeak('Bien compris, je ferme le volet du salon');
                    document.getElementById("esp1_state").checked = false;
                }
            },
            error: function (e) {
                alert(e);
            }
        });
    }
}
function activateRelay2() {
    if (!connect) {
        ttsSpeak('Vous devez être connecté au serveur pour utiliser cette fonctionnalité');
        document.getElementById("esp2_state").checked = false;
    } else {
        if (relay2State == "1")
            myPayload = "2";
        else
            myPayload = "1";

        cordova.plugins.CordovaMqTTPlugin.publish({
            topic: "1floor/shutterEngineDown",
            payload: myPayload,
            qos: 0,
            retain: false,
            success: function (s) {
                if (relay2State == "1") {
                    relay2State = "2";
                    ttsSpeak('Bien compris, je ferme le volet du salon');
                    document.getElementById("esp2_state").checked = true;
                } else {
                    relay2State = "1";
                    ttsSpeak('L\'éclairage du bureau est maintenant éteint');
                    document.getElementById("esp2_state").checked = false;
                }
            },
            error: function (e) {
                alert(e);
            }
        });
    }
}
function activateRelay3() {
    if (!connect) {
        ttsSpeak('Vous devez être connecté au serveur pour utiliser cette fonctionnalité');
        document.getElementById("esp3_state").checked = false;
    } else {
        if (relay3State == "1")
            myPayload = "2";
        else
            myPayload = "1";

        cordova.plugins.CordovaMqTTPlugin.publish({
            topic: "1floor/shutterEngine",
            payload: myPayload,
            qos: 0,
            retain: false,
            success: function (s) {
                if (relay3State == "1") {
                    relay3State = "2";
                    ttsSpeak('Le troisième relais est maintenant actif');
                    document.getElementById("esp3_state").checked = true;
                } else {
                    relay3State = "1";
                    ttsSpeak('Le troisième relais est maintenant éteint');
                    document.getElementById("esp3_state").checked = false;
                }
            },
            error: function (e) {
                alert(e);
            }
        });
    }
}
/**/

/* Use this instead */
function activateRelay(relayNb){
    if (!connect) {
        ttsSpeak('Vous devez être connecté au serveur pour utiliser cette fonctionnalité');
    } else {
            myPayload = "2";

            cordova.plugins.CordovaMqTTPlugin.publish({
            topic: relayNb,
            payload: myPayload,
            qos: 0,
            retain: false,
            success: function (s) {

                 if (relayNb == "3floor/office"){
                    relay3State = "2";
                    document.getElementById("esp2_state").checked = true;
                } else if (relayNb == "1floor/shutterEngineUp"){
                    relay2State = "2";
                } else if (relayNb == "1floor/shutterEngineDown"){
                    relay1State = "2";
                }
            },
            error: function (e) {
                alert(e);
            }
        });
    }
}
function deactivateRelay(relayNb){
    if (!connect) {
        ttsSpeak('Vous devez être connecté au serveur pour utiliser cette fonctionnalité');
    } else {
        myPayload = "1";

        cordova.plugins.CordovaMqTTPlugin.publish({
            topic: relayNb,
            payload: myPayload,
            qos: 0,
            retain: false,
            success: function (s) {

                 if (relayNb == "3floor/office"){
                    relay3State = "1";
                    document.getElementById("esp2_state").checked = false;
                } else if (relayNb == "1floor/shutterEngineUp"){
                    relay2State = "1";
                } else if (relayNb == "1floor/shutterEngineDown"){
                    relay1State = "1";
                }
            },
            error: function (e) {
                alert(e);
            }
        });
    }
}
/**/

/* Vocal function */
function ttsSpeak(message){
    TTS.speak({
        text: message ,
        locale: 'fr-FR',
        rate: 1.0}, function(){}, function(reason){});
}
function startSpeechRecognition() {
    var relayNb = "";
    if (connect == true) {
        window.plugins.speechRecognition.hasPermission(
            function successCallback(hasPermission) {
                if (!hasPermission)
                    ttsSpeak('Impossible d\'utiliser la reconnaissance vocale sans les autorisations d\'accès au microphone');
            }, function errorCallback(err) {
                alert(err);
            });
        window.plugins.speechRecognition.requestPermission(
            function () {
            }, function (err) {
                alert("err");
            });
        var settings = {
            lang: "fr-FR",
            showPopup: true
        };
        window.plugins.speechRecognition.startListening(function (result) {
            if (result[0] == "fermer le volet" ||
                result[0]== "ferme le volet" ||
                result[0] == "ferme volet") {
                ttsSpeak('Bien compris, je ferme le volet');
                relayNb = "1floor/shutterEngineDown";
            } else if (result[0] == "ouvrir le volet" ||
                result[0]== "ouvre le volet" ||
                result[0] == "ouvre volet"){
                ttsSpeak('Bien compris, j\'ouvre le volet');
                relayNb = "1floor/shutterEngineUp";
            }
            if (relayNb != "")
                activateRelay(relayNb);
            relayNb = "";
        }, function (err) {
            alert(err);
        }, settings);
    }
    else {
        ttsSpeak('Vous devez être connecté au serveur pour utiliser cette fonctionnalité');
    }
}
/**/

/* Test */
function mDown(obj, type) {
    if (!connect) {
        ttsSpeak('Vous devez être connecté au serveur pour utiliser cette fonctionnalité');
    } else {
        obj.style.backgroundColor = "#00cc00";
        if (type == 1){
            //deactivateRelay("1floor/shutterEngineDown");
            activateRelay("1floor/shutterEngineUp");
        } else {
            //deactivateRelay("1floor/shutterEngineUp");
            activateRelay("1floor/shutterEngineDown");
        }
    }
}

function mUp(obj, type) {
    obj.style.backgroundColor="#CC0000";
    if (type == 1)
        deactivateRelay("1floor/shutterEngineUp")
    else
        deactivateRelay("1floor/shutterEngineDown")
}

app.initialize();