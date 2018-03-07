// TODO Add image storage functionality
// TODO Add constants
import Foundation
import ARKit
// @rn view=RHDARView
@objc(RHDARViewManager)
class RHDARViewManager: RCTViewManager {
    override func view() -> RHDARView? {
        return RHDARView.sharedInstance()
    }
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    //Add Bridge module methods
    @objc func pause(_ resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        if let v = view() { v.pause() }
        resolve(nil)
    }
    @objc func resume(_ resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        if let v = view() { v.resume() }
        resolve(nil) 
    }
    //types=NSNumber
    @objc func hitTestPlanes(_ pointDict:jsonType, types:Int, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        guard let v = view(), let point = pointFromDict(pointDict) else { reject(nil,nil,nil); return }
        v.hitTestPlane(point, types:ARHitTestResult.ResultType(rawValue: UInt(types)), resolve: resolve, reject: reject)
    }
    @objc func hitTestSceneObjects(_ pointDict:jsonType, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        guard let v = view(), let point = pointFromDict(pointDict) else { reject(nil, nil, nil); return }
        v.hitTestSceneObjects(point, resolve: resolve, reject: reject)
    }
    @objc func getCamera(_ resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        guard let v = view() else { reject(nil, nil, nil); return }
        resolve(v.readCamera())
    }
    @objc func getCameraPosition(_ resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        guard let v = view() else { reject(nil, nil, nil); return }
        resolve(v.readCameraPosition())
    }
    @objc func focusScene(_ resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        guard let v = view() else { reject(nil, nil, nil) ; return }
        resolve(v.focusScene())
    }
    @objc func clearScene(_ resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        guard let v = view() else { reject(nil, nil, nil); return }
        resolve(v.clearScene())
    }
    @objc func projectPoint(_ pointDict:jsonType, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        guard let vw = view() else {reject(nil, nil, nil); return }
        let v = RCTConvert.SCNVector3(pointDict)
        let v2 = vw.projectPoint(v)
        let d = vw.getCameraDistanceToPoint(v2)
        resolve(["x":v2.x, "y":v2.y, "z":v2.z, "distance": d])
    }
}
func pointFromDict(_ pointDict:jsonType)->CGPoint? {
    guard let x = pointDict["x"] as? CGFloat, let y = pointDict["y"] as? CGFloat else { return nil }
    return CGPoint(x: x, y: y)
}
