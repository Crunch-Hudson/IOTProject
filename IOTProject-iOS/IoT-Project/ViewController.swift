//
//  ViewController.swift
//  IoT-Project
//
//  Created by Arthur Hatchiguian on 21/01/2018.
//  Copyright © 2018 Arthur Hatchiguian. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var stopButton: UIButton!
    @IBOutlet weak var closeButton: UIButton!
    @IBOutlet weak var openButton: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        MQTTManager.shared.connect()
        
        openButton.backgroundColor = .red
        closeButton.backgroundColor = .red
        stopButton.backgroundColor = .red
        // Do any additional setup after loading the view, typically from a nib.
    }



    @IBAction func openClicked(_ sender: Any) {
        MQTTManager.shared.voletUPOff()
        openButton.backgroundColor = .red
        print("openClicked")
    }
    
    @IBAction func openTouchDown(_ sender: Any) {
        print("openTouchDown")
        openButton.backgroundColor = .green
        MQTTManager.shared.voletUP()
    }
    
    @IBAction func openStopClicked(_ sender: Any) {
        closeButton.backgroundColor = .red
        MQTTManager.shared.voletDOWNOff()
        MQTTManager.shared.voletUPOff()
        openButton.backgroundColor = .red
        print("openStopClicked")
    }
    
    
    
    @IBAction func closeClicked(_ sender: Any) {
        print("closeClicked")
         MQTTManager.shared.voletDOWNOff()
        closeButton.backgroundColor = .red
    }
  
    @IBAction func closeTouchDown(_ sender: Any) {
        closeButton.backgroundColor = .green
        MQTTManager.shared.voletDOWN()
        print("closeTouchDown")
    }

    

    
    
}

