import Foundation
import CoreMotion
import SceneKit
@objc class RHDARDeviceMotion: RCTEventEmitter {
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    var motionManager = CMMotionManager()
    override func supportedEvents() -> [String]! {
        return ["MotionData"]
    }
    @objc func setUpdateInterval(_ interval:Double) {
        motionManager.deviceMotionUpdateInterval = interval
    }
    @objc func getUpdateInterval(_ cb:RCTResponseSenderBlock) {
        cb([NSNull(), self.motionManager.deviceMotionUpdateInterval])
    }
    @objc func getData(_ cb:RCTResponseSenderBlock) {
        guard let dm = motionManager.deviceMotion else { return }
        let g = dm.gravity
        let rm = dm.attitude.rotationMatrix
        cb([NSNull(), NSDictionary(dictionary: ["gravity": vector3ToJson(SCNVector3(x: Float(g.x), y: Float(g.y), z: Float(g.z))), "rotationMatrix": matrix3ToJson(rm)])])
    }
    internal var listeners:Double = 0 
    override func addListener(_ eventName: String!) {
        guard let _ = supportedEvents().index(of: eventName)  else { return }
        listeners = listeners + 1
        startUpdates()
    }
    override func removeListeners(_ count: Double) {
        listeners = listeners - count
        if(listeners < 1) {
            stopUpdates()
        }
    }
    internal var updating:Bool = false
    func startUpdates()  {
        guard !updating else { return }
        motionManager.startDeviceMotionUpdates()
        motionManager.startDeviceMotionUpdates(to: OperationQueue.main) {dm, err in
            guard let d = dm else { return }
            let g = d.gravity
            let rm = d.attitude.rotationMatrix
            self.sendEvent(withName: "MotionData", body:["gravity": vector3ToJson(SCNVector3(x: Float(g.x), y: Float(g.y), z: Float(g.z))), "rotationMatrix": matrix3ToJson(rm)])
        }
    }
    func stopUpdates() {
        guard updating else { return }
        motionManager.stopDeviceMotionUpdates()
    }
}
func matrix3ToJson(_ rm:CMRotationMatrix) -> jsonType {
    return [
        "m11": rm.m11,
        "m12": rm.m12,
        "m13": rm.m13,
        "m21": rm.m21,
        "m22": rm.m22,
        "m23": rm.m23,
        "m31": rm.m31,
        "m32": rm.m32,
        "m33": rm.m33
    ]
}
