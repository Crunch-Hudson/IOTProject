//
//  MQTTManager.swift
//  IoT-Project
//
//  Created by Arthur Hatchiguian on 21/01/2018.
//  Copyright © 2018 Arthur Hatchiguian. All rights reserved.
//

import UIKit
import CocoaMQTT
//allumer: 1
//eteindre: 2

let voletUp = "1floor/shutterEngineUp"
let voletDown = "1floor/shutterEngineDown"
let office = "3floor/office "


class MQTTManager: NSObject, CocoaMQTTDelegate{
    static let shared = MQTTManager()
    var mqtt: CocoaMQTT?
    
    func connect() {
        print("connect")
        
        //89.87.205.89:1883
        let clientID = "CocoaMQTT-" + String(ProcessInfo().processIdentifier)
        mqtt = CocoaMQTT(clientID: clientID, host: "89.87.205.89", port: 1883)
       // var mqtt = CocoaMQTT(clientID: clientID, host: "89.87.205.89", port: 1883)
        mqtt!.logLevel = .debug
        mqtt!.username = ""
        mqtt!.password = ""
        mqtt!.willMessage = CocoaMQTTWill(topic: "/will", message: "dieout")
        mqtt!.keepAlive = 60
        mqtt!.delegate = self
        mqtt!.connect()
        
        
        
    }
    
    func disconnect() {
        print("disconnect")
    }
    
    
    
    func voletUP() {
        mqtt?.publish(voletUp, withString: "2")
    }
    
    func voletUPOff() {
        mqtt?.publish(voletUp, withString: "1")
    }
    
    func voletDOWN() {
        mqtt?.publish(voletDown, withString: "2")
    }
    
    func voletDOWNOff() {
        mqtt?.publish(voletDown, withString: "1")
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didConnectAck ack: CocoaMQTTConnAck) {
        print("didConnectAck")
    }
    func mqtt(_ mqtt: CocoaMQTT, didPublishMessage message: CocoaMQTTMessage, id: UInt16){
        
    }
    func mqtt(_ mqtt: CocoaMQTT, didPublishAck id: UInt16){
        
    }
    func mqtt(_ mqtt: CocoaMQTT, didReceiveMessage message: CocoaMQTTMessage, id: UInt16 ){
        print("didReceiveMessage %@", message)
    }
    func mqtt(_ mqtt: CocoaMQTT, didSubscribeTopic topic: String){
        
    }
    func mqtt(_ mqtt: CocoaMQTT, didUnsubscribeTopic topic: String){
        
    }
    func mqttDidPing(_ mqtt: CocoaMQTT){
        
    }
    func mqttDidReceivePong(_ mqtt: CocoaMQTT){
        
    }
    func mqttDidDisconnect(_ mqtt: CocoaMQTT, withError err: Error?){
        
    }
    
    
    
    
}
