// TODO Add image storage functionality
// TODO Add constants
import Foundation
import ARKit
// @rn view=RHDARView
@objc(RHDARViewManager)
class RHDARViewManager: RCTViewManager {
    override func view() -> RHDARView {
        return RHDARView.sharedInstance()
    }
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
    override func constantsToExport() -> [AnyHashable : Any]! {
        //Exporting type/enum constants
        return [
            "ARHitTestResultType": [
                "featurePoint": ARHitTestResult.ResultType.featurePoint,
                "EstimatedHorizontalPlane": ARHitTestResult.ResultType.estimatedHorizontalPlane,
                "ExistingPlane": ARHitTestResult.ResultType.existingPlane,
                "ExistingPlaneUsingExtent": ARHitTestResult.ResultType.existingPlaneUsingExtent
            ],
            "LightingModel": [
                "Constant": SCNMaterial.LightingModel.constant,
                "Blinn": SCNMaterial.LightingModel.blinn,
                "Lambert": SCNMaterial.LightingModel.lambert,
                "Phong": SCNMaterial.LightingModel.phong,
                "PhysicallyBased": SCNMaterial.LightingModel.physicallyBased
            ],
            "LightType":[
                "Ambient": SCNLight.LightType.ambient,
                "Directional": SCNLight.LightType.directional,
                "Omni": SCNLight.LightType.omni,
                "Probe": SCNLight.LightType.probe,
                "Spot": SCNLight.LightType.spot,
                "IES": SCNLight.LightType.IES
            ],
            "ShadowMode":[
                "Forward": SCNShadowMode.forward,
                "Deferred": SCNShadowMode.deferred,
                "ModeModulated": SCNShadowMode.modulated
            ],
            "ColorMask":[
                "All": SCNColorMask.all,
                "None": 0,
                "Alpha": SCNColorMask.alpha,
                "Blue": SCNColorMask.blue,
                "Red": SCNColorMask.red,
                "Green": SCNColorMask.green
            ],
            "ShaderModiferEntryPoint":[
                "Geometry": SCNShaderModifierEntryPoint.geometry,
                "Surface": SCNShaderModifierEntryPoint.surface,
                "LightingModel": SCNShaderModifierEntryPoint.lightingModel,
                "Fragment": SCNShaderModifierEntryPoint.fragment
            ],
            "BlendMode":[
                "Alpha": SCNBlendMode.alpha,
                "Add": SCNBlendMode.add,
                "Subtract": SCNBlendMode.subtract,
                "Multiply": SCNBlendMode.multiply,
                "Screen": SCNBlendMode.screen,
                "Replace": SCNBlendMode.replace
            ],
            "ChamferMode":[
                "Both": SCNChamferMode.both,
                "Back": SCNChamferMode.back,
                "Front": SCNChamferMode.front
            ],
            "ARWorldAlignment":[
                "Gravity": ARWorldTrackingConfiguration.WorldAlignment.gravity,
                "GravityAndHeading": ARWorldTrackingConfiguration.WorldAlignment.gravityAndHeading,
                "Camera": ARWorldTrackingConfiguration.WorldAlignment.camera
            ],
            "FillMode":[
                "Fill": SCNFillMode.fill,
                "Lines": SCNFillMode.lines
            ]
        ]
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
