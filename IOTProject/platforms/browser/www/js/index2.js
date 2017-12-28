/*
index.js
*/
var connect = false;
var relay1State = "1";
var myPayload = "1";
var available = false;
var recognition = null;
var subscribe = false;
var brokerAddr = "";
var brokerPort = "";

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        //this.subscribeESPTopic();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        recognition = new SpeechRecognition();
        recognition.onresult = function(event){
            if (event.results.length > 0){
                var test1 = document.getElementById("speechButton");
                test1.innerHTML = event.results[0][0].transcript;
            }
        };
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    append: function (id,s) {
        // it is just a string append function. Nothing to do with the MQTT functions
        var node = document.createElement("p");                 // Create a <li> node
        var textnode = document.createTextNode(s);         // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>
        document.getElementById(id).appendChild(node);     // Append <li> to <ul> with id="myList"
    }
};


/* Connection management */
function startConnection(){
    alert("touchend connect");
    if (document.getElementById("brokerAddress").value.substr(0,6) != "tcp://")
        document.getElementById("brokerAddress").value = "tcp://"+document.getElementById("brokerAddress").value;
    cordova.plugins.CordovaMqTTPlugin.connect({
        url:document.getElementById("brokerAddress").value,
        port:document.getElementById("port").value,
        clientId:document.getElementById("clientid").value,
        success:function(s){
            connect = true;
            console.log(JSON.stringify(s));
            document.getElementById("Connect").style.display = "none";
            document.getElementById("Disconnect").style.display = "block";
            brokerAddr = document.getElementById("brokerAddress").value;
            brokerPort = document.getElementById("port").value;
            document.getElementById("connectionState").value = "Connected";
            alert("Connected !");
            //document.getElementById("activity").innerHTML += "--> Success: you are connected to, "+document.getElementById("url").value+":"+document.getElementById("port").value+"<br>"
        },
        error:function(e){
            connect = false;
            //document.getElementById("activity").innerHTML += "--> Error: something is wrong,\n "+JSON.stringify(e)+"<br>";
            document.getElementById("Connect").style.display = "block";
            document.getElementById("Disconnect").style.display = "none";
            document.getElementById("connectionState").value = "Disconnected";
            alert("err!! something is wrong. check the console")
            console.log(e);
        },
        onConnectionLost:function (){
            connect = false;
            //document.getElementById("activity").innerHTML += "--> You got disconnected";
            document.getElementById("Connect").style.display = "block";
            document.getElementById("Disconnect").style.display = "none";
        }
    });
    alert("cordovaMqttPlugin connect end");
}

function endConnection(){
    document.getElementById("Connect").style.display = "block";
    document.getElementById("Disconnect").style.display = "none";
    cordova.plugins.CordovaMqTTPlugin.disconnect({
        success:function(s){
            connect = false;
            document.getElementById("Connect").style.display = "block";
            document.getElementById("Disconnect").style.display = "none";
            brokerAddr = "";
            brokerPort = "";
            document.getElementById("connectionState").value = "Disconnected";
            //document.getElementById("activity").innerHTML += "--> Success: you are now disconnected"+"<br>"
        },
        error:function(e){
            //document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
            document.getElementById("Connect").style.display = "none";
            document.getElementById("Disconnect").style.display = "block";
            //alert("err!! something is wrong. check the console")
            console.log(e);
        }
    });
}

/* MQTT function */
function publishMessage(){
    if (!connect) {
        alert("First establish connection then try to publish")
    } else {
        cordova.plugins.CordovaMqTTPlugin.publish({
            topic:document.getElementById("topic").value,
            payload:document.getElementById("message").value,
            qos:0,
            retain:false,
            success:function(s){
                //document.getElementById("activity").innerHTML += "--> Success: you have published to the topic, "+document.getElementById("topic_sub").value+"<br>";
            },
            error:function(e){
                //document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                //alert("err!! something is wrong. check the console")
                console.log(e);
            }
        });
    }
}

function listenESPTopic(){
    if (subscribe == true){
        cordova.plugins.CordovaMqTTPlugin.listen("espState/ESP1",function(payload,params){
            if (payload == "1"){
                // MAJ de l'UI pour ESP1
                document.getElementById("esp1_state").checked = true;
            }
            else {
                document.getElementById("esp1_state").checked = false;
            }
        });
        cordova.plugins.CordovaMqTTPlugin.listen("espState/ESP2",function(payload,params){
            if (payload == "1"){
                // MAJ de l'UI pour ESP2
                document.getElementById("esp2_state").checked = true;
            }
            else {
                document.getElementById("esp2_state").checked = false;
            }
        });
        cordova.plugins.CordovaMqTTPlugin.listen("espState/ESP3",function(payload,params){
            if (payload == "1"){
                // MAJ de l'UI pour ESP3
                document.getElementById("esp3_state").checked = true;
            }
            else {
                document.getElementById("esp3_state").checked = false;
            }
        });
    }
}

function subscribeESPTopic(){
    cordova.plugins.CordovaMqTTPlugin.subscribe({
        topic:"espState/#",
        qos:0,
        success:function(s){
            subscribe = true;
            listenESPTopic();
        },
        error:function(e){
            alert("Can't subscribe to espState topic.");
        }
    });
}

function activateRelay1(){
    if (!connect){
        alert("First establish connection then try to publish")
    } else {
        if (relay1State == "1")
            myPayload = "2";
        else
            myPayload = "1";

        cordova.plugins.CordovaMqTTPlugin.publish({
            topic:"topic/lamp",
            payload:myPayload,
            qos:0,
            retain:false,
            success:function(s){
                if (relay1State == "1") {
                    relay1State = "2";
                    document.getElementById("esp1_state").checked = true;
                } else {
                    relay1State = "1";
                    document.getElementById("esp1_state").checked = true;
                }
            },
            error:function(e){
                alert(e);
            }
        });
    }
}

/* SpeechRecognition */
function startSpeechRecognition(){
    if (connect == true){
        window.plugins.speechRecognition.hasPermission(
            function successCallback(hasPermission){
                if (!hasPermission)
                    alert("You can't use speech recognition \n without grant permission.");
            }, function errorCallback(err){
                alert(err);
            });
        window.plugins.speechRecognition.requestPermission(
            function(){}, function (err){
                alert("err");
            });
        var settings = {
            lang: "fr-FR",
            showPopup: true
        };
        window.plugins.speechRecognition.startListening(function(result){
            alert(result[0]);
            if (result.includes("allumer relais 1") || result.includes("allume la lampe")
                || result.includes("allume le relais 1")){
                alert("result match");
                activateRelay1();
            }
        }, function(err){
            alert(err);
        }, settings);
    }
    else{
        alert("First establish connection then try to publish");
    }
}


app.initialize();