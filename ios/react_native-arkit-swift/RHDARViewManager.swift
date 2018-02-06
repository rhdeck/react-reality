// TODO Add image storage functionality
// TODO Add constants
import Foundation
import ARKit
// @rn view=RHDARView
@objc class RHDARViewManager: RCTViewManager {
    override func view() -> RHDARView {
        return RHDARView.sharedInstance()
    }
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
    //Add Bridge module methods
    @objc func pause(_ resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        view().pause()
        resolve(nil)
    }
    @objc func resume(_ resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        view().resume()
        resolve(nil)
    }
    //types=NSNumber
    @objc func hitTestPlanes(_ pointDict:jsonType, types:Int, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        guard let point = pointFromDict(pointDict) else { reject(nil,nil,nil); return }
        view().hitTestPlane(point, types:ARHitTestResult.ResultType(rawValue: UInt(types)), resolve: resolve, reject: reject)
    }
    @objc func hitTestSceneObjects(_ pointDict:jsonType, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        guard let point = pointFromDict(pointDict) else { reject(nil, nil, nil); return }
        view().hitTestSceneObjects(point, resolve: resolve, reject: reject)
    }
    @objc func getCamera(_ resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        resolve(view().readCamera())
    }
    @objc func getCameraPosition(_ resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        resolve(view().readCameraPosition())
    }
    @objc func focusScene(_ resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        resolve(view().focusScene())
    }
    @objc func clearScene(_ resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        resolve(view().clearScene())
    }
    @objc func projectPoint(_ pointDict:jsonType, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        let v = RCTConvert.SCNVector3(pointDict)
        let v2 = view().projectPoint(v)
        let d = view().getCameraDistanceToPoint(v2)
        resolve(["x":v2.x, "y":v2.y, "z":v2.z, "distance": d])
    }
}
func pointFromDict(_ pointDict:jsonType)->CGPoint? {
    guard let x = pointDict["x"] as? CGFloat, let y = pointDict["y"] as? CGFloat else { return nil }
    return CGPoint(x: x, y: y)
}
