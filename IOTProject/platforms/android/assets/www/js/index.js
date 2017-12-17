/*
index.js
*/
var connect = false;
var relay1State = "1";
var myPayload = "1";
var available = false;
var recognition = null;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
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
        alert("toto");
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
        document.getElementById("connect").addEventListener('touchend',function(ev){
            cordova.plugins.CordovaMqTTPlugin.connect({
                url:document.getElementById("url").value, //a public broker used for testing purposes only. Try using a self hosted broker for production.
                port:document.getElementById("port").value,
                clientId:document.getElementById("clientId").value,
                success:function(s){
                    connect = true;
                    console.log(JSON.stringify(s));
                    document.getElementById("connect").style.display = "none";
                    document.getElementById("disconnect").style.display = "block";
                    document.getElementById("activity").innerHTML += "--> Success: you are connected to, "+document.getElementById("url").value+":"+document.getElementById("port").value+"<br>"
                },
                error:function(e){
                    connect = false;
                    document.getElementById("activity").innerHTML += "--> Error: something is wrong,\n "+JSON.stringify(e)+"<br>";
                    document.getElementById("connect").style.display = "block";
                    document.getElementById("disconnect").style.display = "none";
                    alert("err!! something is wrong. check the console")
                    console.log(e);
                },
                onConnectionLost:function (){
                    connect = false;
                    document.getElementById("activity").innerHTML += "--> You got disconnected";
                    document.getElementById("connect").style.display = "block";
                    document.getElementById("disconnect").style.display = "none";
                }
            })
        });
        document.getElementById("disconnect").addEventListener('touchend',function(e){
            document.getElementById("connect").style.display = "block";
            document.getElementById("disconnect").style.display = "none";
            cordova.plugins.CordovaMqTTPlugin.disconnect({
                success:function(s){
                    connect = false;
                    document.getElementById("connect").style.display = "block";
                    document.getElementById("disconnect").style.display = "none";
                    document.getElementById("activity").innerHTML += "--> Success: you are now disconnected"+"<br>"
                },
                error:function(e){
                    document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                    document.getElementById("connect").style.display = "none";
                    document.getElementById("disconnect").style.display = "block";
                    //alert("err!! something is wrong. check the console")
                    console.log(e);
                }
            });
        });
        document.getElementById("subscribe").addEventListener('touchend',function(ev){
            if (!connect) {
                alert("First establish connection then try to subscribe");
            } else {
                cordova.plugins.CordovaMqTTPlugin.subscribe({
                    topic:document.getElementById("topic_sub").value,
                    qos:0,
                    success:function(s){
                        document.getElementById("subscribe").style.display = "none";
                        document.getElementById("unsubscribe").style.display = "block";
                        document.getElementById("activity").innerHTML += "--> Success: you are subscribed to the topic, "+document.getElementById("topic_sub").value+"<br>"
                        //get your payload here
                        //Deprecated method
                        document.addEventListener(document.getElementById("topic_sub").value,function (e) {
                            e.preventDefault();
                            document.getElementById("activity").innerHTML += "--> Payload for"+e.topic+" topic: "+JSON.stringify(e.payload)+"<br>"
                        });
                        cordova.plugins.CordovaMqTTPlugin.listen(document.getElementById("topic_sub").value,function (payload,params,topic,topic_pattern) {
                            //params will be an empty object if topic pattern is NOT used.
                            document.getElementById("activity").innerHTML += "--> Payload for"+topic+" topic: "+JSON.stringify(payload)+"<br>"
                        })
                    },
                    error:function(e){
                        document.getElementById("activity").innerHTML += "--> Error: something is wrong when subscribing to this topic, "+e+"<br>";
                        document.getElementById("subscribe").style.display = "block";
                        document.getElementById("unsubscribe").style.display = "none";
                        //alert("err!! something is wrong. check the console")
                        console.log(e);
                    }
                });
            }
        });
        document.getElementById("unsubscribe").addEventListener('touchend',function(ev){
            cordova.plugins.CordovaMqTTPlugin.unsubscribe({
                topic:document.getElementById("topic_sub").value,
                success:function(s){
                    document.removeEventListener(document.getElementById("topic_sub").value);
                    document.getElementById("unsubscribe").style.display = "none";
                    document.getElementById("subscribe").style.display = "block";
                    document.getElementById("activity").innerHTML += "--> Success: you are unsubscribed to the topic, "+document.getElementById("topic_sub").value+"<br>"
                    document.getElementById("topic_sub").value = "";
                },
                error:function(e){
                    document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                    document.getElementById("subscribe").style.display = "block";
                    document.getElementById("unsubscribe").style.display = "none";
                    //alert("err!! something is wrong. check the console")
                    console.log(e);
                }
            });
        });
        document.getElementById("publish").addEventListener('touchend',function(ev){
            if (!connect) {
                alert("First establish connection then try to publish")
            } else {
                cordova.plugins.CordovaMqTTPlugin.publish({
                    topic:document.getElementById("topic_pub").value,
                    payload:document.getElementById("payload").value,
                    qos:0,
                    retain:false,
                    success:function(s){
                        document.getElementById("activity").innerHTML += "--> Success: you have published to the topic, "+document.getElementById("topic_sub").value+"<br>";
                    },
                    error:function(e){
                        document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                        //alert("err!! something is wrong. check the console")
                        console.log(e);
                    }
                });
            }
        });

        /* Relay 1 */
        document.getElementById("relay1").addEventListener('touchend', activateRelay1);

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
                            document.getElementById("activity").innerHTML += "--> Relay 1 activated, "+
                                document.getElementById("topic_sub").value+"<br>";
                            document.getElementById("relay1").innerHTML = "Activated";
                            relay1State = "2";
                        } else {
                            document.getElementById("activity").innerHTML += "--> Relay 1 deactivated, "+
                                document.getElementById("topic_sub").value+"<br>";
                            document.getElementById("relay1").innerHTML = "deactivated";
                            relay1State = "1";
                        }
                    },
                    error:function(e){
                        document.getElementById("activity").innerHTML += "--> Error: Unable to activate the Relay 1, "+e+"<br>";
                        alert(e);
                    }
                });
            }
        }

        /* Speech recognition */
        document.getElementById("speechButton").addEventListener('touchend', function(){
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
                    activateRelay1();
                }
            }, function(err){
                alert(err);
            }, settings);
        });
        console.log('Received Event: ' + id);
    },
    append:function (id,s) {
        // it is just a string append function. Nothing to do with the MQTT functions
        var node = document.createElement("p");                 // Create a <li> node
        var textnode = document.createTextNode(s);         // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>
        document.getElementById(id).appendChild(node);     // Append <li> to <ul> with id="myList"
    }
};

app.initialize();