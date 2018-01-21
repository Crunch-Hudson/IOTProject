//
//  ViewController.swift
//  IoT-Project
//
//  Created by Arthur Hatchiguian on 21/01/2018.
//  Copyright © 2018 Arthur Hatchiguian. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var switchButton: UISwitch!
    @IBOutlet weak var closeButton: UIButton!
    @IBOutlet weak var openButton: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        MQTTManager.shared.connect()
        
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func openClicked(_ sender: Any) {
        print("openClicked")
    }
    
    @IBAction func closeClicked(_ sender: Any) {
        print("closeClicked")
    }
    
    @IBAction func switchClicked(_ sender: Any) {
        switchButton.isOn ? print("switchClicked ON") : print("switchClicked OFF")
        switchEnabled(on: switchButton.isOn)
    }

    func switchEnabled(on: Bool) {
        if on {
            
        } else {
            
        }
    }
    
    
}

