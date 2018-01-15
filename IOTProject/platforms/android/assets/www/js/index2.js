/*
index.js
*/
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
            //document.getElementById("activity").innerHTML += "--> Success: you are connected to, "+document.getElementById("url").value+":"+document.getElementById("port").value+"<br>"
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
            topic: "1floor/lamp",
            payload: myPayload,
            qos: 0,
            retain: false,
            success: function (s) {
                if (relay1State == "1") {
                    relay1State = "2";
                    ttsSpeak('La lampe du salon est maintenant allumée');
                    document.getElementById("esp1_state").checked = true;
                } else {
                    relay1State = "1";
                    ttsSpeak('La lampe du salon est maintenant éteinte');
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
            topic: "3floor/office",
            payload: myPayload,
            qos: 0,
            retain: false,
            success: function (s) {
                if (relay2State == "1") {
                    relay2State = "2";
                    ttsSpeak('L\'éclairage du bureau est maintenant allumé');
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
            topic: "topic/lamp",
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

/* Vocal function */
function ttsSpeak(message){
    TTS.speak({
        text: message ,
        locale: 'fr-FR',
        rate: 1.0}, function(){}, function(reason){});
}

function startSpeechRecognition() {
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
            alert(result[0]);
            if (result.includes("Allumer la lampe du salon") ||
                result.includes("Allumer lampe salon") ||
                result.includes("Active le relais un")) {
                ttsSpeak('Bien compris, j\'allume la lampe du salon');
                activateRelay1();
            } else if (result.includes("Allumer éclairage du bureau") ||
                       result.includes("Allume le bureau") ||
                       result.includes("Active le relais trois")){
                ttsSpeak('Bien compris, j\'allume la lampe du bureau');
                activateRelay2();
            }
        }, function (err) {
            alert(err);
        }, settings);
    }
    else {
        ttsSpeak('Vous devez être connecté au serveur pour utiliser cette fonctionnalité');
    }
}

app.initialize();