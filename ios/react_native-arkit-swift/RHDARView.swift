// TODO Touches and properties.
import Foundation
import CoreLocation
import ARKit

@objc class RHDARView:UIView, ARSessionDelegate, ARSCNViewDelegate {
    // MARK: - Properties
    var wtConfig:ARWorldTrackingConfiguration?
    var isInitialized: Bool = false
    var isInitializing: Bool = false
    var arView: ARSCNView?
    var nodeManager: RHDARNodeManager = RHDARNodeManager.sharedInstance
    @objc var onPlaneDetected: RCTBubblingEventBlock?
    @objc var onPlaneRemoved: RCTBubblingEventBlock?
    @objc var onFeaturesDetected: RCTBubblingEventBlock?
    @objc var onLightEstimation: RCTBubblingEventBlock?
    @objc var onPlaneUpdate: RCTBubblingEventBlock?
    @objc var onTrackingState: RCTBubblingEventBlock?
    @objc var onTapOnPlaneUsingExtent: RCTBubblingEventBlock?
    @objc var onTapOnPlaneNoExtent: RCTBubblingEventBlock?
    @objc var onEvent: RCTBubblingEventBlock?
    @objc var onARKitError: RCTBubblingEventBlock?
    var _configuration:ARWorldTrackingConfiguration?
    var session:ARSession? {
        get { return arView?.session }
    }
    var configuration:ARWorldTrackingConfiguration {
        get {
            if let c = _configuration {
                return c
            } else {
                let c = ARWorldTrackingConfiguration()
                c.planeDetection = .horizontal
                _configuration = c
                return c
            }
        }
    }
    @objc var debug:Bool {
        get { return arView?.showsStatistics ?? false }
        set(v) { arView?.showsStatistics = v; if v { arView?.debugOptions = ARSCNDebugOptions.showFeaturePoints } }
    }
    @objc var planeDetection:Bool {
        get { return configuration.planeDetection == .horizontal }
        set(v) { configuration.planeDetection = v ? .horizontal : ARWorldTrackingConfiguration.PlaneDetection(rawValue: 0) ; resume() }
    }
    @objc var origin: jsonType {
        get { return ["position": vector3ToJson(nodeManager.localOrigin.position)]}
        set(v) {
            if let d = v["transition"] as? jsonType, let f = d["duration"] as? Double { SCNTransaction.animationDuration = f }
            else { SCNTransaction.animationDuration = 0  }
            if let d = v["position"] as? jsonType { nodeManager.localOrigin.position = RCTConvert.SCNVector3(d) }
        }
    }
    @objc var lightEstimationEnabled:Bool {
        get { return configuration.isLightEstimationEnabled}
        set(v) { configuration.isLightEstimationEnabled = v ; resume() }
    }
    @objc var autoEnablesDefaultLighting:Bool {
        get { return arView?.automaticallyUpdatesLighting ?? false }
    }
    //@rn type=NSInteger
    @objc var worldAlignment:ARConfiguration.WorldAlignment {
        get { return configuration.worldAlignment}
        set(v) { configuration.worldAlignment = v ; resume() }
    }
    // MARK: - Statics

    static var _sharedInstance:RHDARView = RHDARView()
    class func sharedInstance() -> RHDARView {
        //Check for initialization then let her rip
        if(!_sharedInstance.isInitialized && !_sharedInstance.isInitializing) {
            _sharedInstance.isInitializing = true
            DispatchQueue.main.async() {
                let arv = ARSCNView()
                _sharedInstance.initAR(arv)
                _sharedInstance.isInitialized = true
                _sharedInstance.isInitializing = false;
            }
        }
        return _sharedInstance
    }
    // MARK: - Instance Methods
    func initAR(_ arv:ARSCNView) {
        arView = arv
        arv.delegate = self
        arv.session.delegate = self
        //Interaction delegates TODO
        
        //Nodemanager
        nodeManager.setARView(arv)
        arv.autoenablesDefaultLighting = true
        arv.scene.rootNode.name = "root"
        addSubview(arv)
        resume()
    }
    override func layoutSubviews() {
        super.layoutSubviews()
        arView?.frame = self.bounds
    }
    func pause() {
        session?.pause()
    }
    func resume() {
        session?.run(configuration)
    }
    func session(_ session: ARSession, didFailWithError error: Error) {
        if let e = onARKitError {
            e(RCTJSErrorFromNSError(error))
        }
    }
    func reset() {
        guard ARWorldTrackingConfiguration.isSupported, let s = session else { return }
        s.run(configuration, options: [ARSession.RunOptions.removeExistingAnchors, ARSession.RunOptions.resetTracking])
    }
    func focusScene() {
        nodeManager.localOrigin.position = nodeManager.cameraOrigin.position
        nodeManager.localOrigin.rotation = nodeManager.cameraOrigin.rotation
    }
    func clearScene() {
        nodeManager.clear()
    }
    func readCamera() -> jsonType {
        return [
            "position": nodeManager.cameraOrigin.position,
            "rotation":  nodeManager.cameraOrigin.rotation,
            "orientation": nodeManager.cameraOrigin.orientation,
            "eulerAngles": nodeManager.cameraOrigin.eulerAngles,
            "direction": nodeManager.cameraDirection
        ]
    }
    func readCameraPosition() -> jsonType {
        return vector3ToJson(nodeManager.cameraOrigin.position)
    }
    func projectPoint(_ point:SCNVector3) -> SCNVector3 {
        guard let arv = arView else { return SCNVector3() }
        return arv.projectPoint(nodeManager.getAbsolutePositionToOrigin(point))
    }
    func getCameraDistanceToPoint(_ point:SCNVector3) -> Float {
        return nodeManager.getCameraDistanceToPoint(point)
    }
    func hitTestSceneObjects(_ point:CGPoint, resolve:RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(nodeManager.getSceneObjectsHitResult(point))
    }
    func getSnapShot(_ json:jsonType) -> UIImage {
        guard let i = arView?.snapshot() else { return UIImage() }
        return cropImage(i, json: json)
    }
    func getSnapShotCamera(_ json:jsonType) -> UIImage {
        guard let s = session, let cf = s.currentFrame else { return UIImage() }
        let pb = cf.capturedImage
        let ci = CIImage(cvImageBuffer: pb)
        let context = CIContext()
        guard let cgi = context.createCGImage(ci, from: CGRect(x:0,y:0,width:CGFloat(CVPixelBufferGetWidth(pb)), height:CGFloat(CVPixelBufferGetHeight(pb)))) else { return UIImage() }
        let i = UIImage(cgImage: cgi, scale: 1.0, orientation: UIImageOrientation.right)
        return cropImage(i, json:json)
    }
    func cropImage(_ image:UIImage, json: jsonType) -> UIImage{
        let i = rotate(image, orientation:image.imageOrientation)
        guard i.size.width > 0 else { return image }
        let viewAspectRatio = bounds.height / bounds.width
        let imageAspectRatio = i.size.height / i.size.width
        var outHeight:CGFloat = 0
        var outWidth:CGFloat = 0
        if viewAspectRatio > imageAspectRatio {
            outHeight = i.size.height
            outWidth = outHeight / viewAspectRatio
        } else {
            outWidth = i.size.width
            outHeight = outWidth * viewAspectRatio
        }
        var y = i.size.height - outHeight / 2
        var x = i.size.width - outWidth / 2
        if let f = json["x"] as? CGFloat { x = x + f }
        if let f = json["y"] as? CGFloat { y = y + f }
        if let f = json["width"] as? CGFloat { outWidth  = f * i.size.width / bounds.width }
        if let f = json["height"] as? CGFloat { outHeight = f * i.size.height / bounds.height }
        let rect = CGRect(x:x, y:y, width: outWidth, height: outHeight)
        return cropImageRect(i, toRect:rect)
    }
    func hitTestPlane(_ point:CGPoint, types:ARHitTestResult.ResultType, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        resolve(getPlaneHitResult(point, types:types))
    }
    func getPlaneHitResult(_ point:CGPoint, types: ARHitTestResult.ResultType) -> jsonType {
        guard let arv = self.arView else { return [:] }
        let r = arv.hitTest(point, types: types)
        let mr = nodeManager.mapHitResults(r)
        return getPlaneHitResult(mr, point: point)
    }
    func getPlaneHitResult(_ mr:[Any], point: CGPoint) -> jsonType {
        return ["results": mr, "tapPoint": ["x": point.x, "y": point.y]]
    }
    func handleTapFrom(_ recognizer:UITapGestureRecognizer) {
        guard let arv = self.arView else { return }
        let p = recognizer.location(in: arv)
        if let cb = onTapOnPlaneUsingExtent {
            let r = getPlaneHitResult(p, types:ARHitTestResult.ResultType.existingPlaneUsingExtent)
            cb(r)
        }
        if let cb = onTapOnPlaneNoExtent {
            let r = getPlaneHitResult(p, types:ARHitTestResult.ResultType.existingPlane)
            cb(r)
        }
    }
    func makePlaneDetectionResult(_ node:SCNNode, planeAnchor:ARPlaneAnchor) -> jsonType {
        return [
            "id": planeAnchor.identifier.uuidString,
            "alignment": planeAnchor.alignment,
            "eulerAngles": vector3ToJson(node.eulerAngles),
            "position": vector3ToJson(nodeManager.getRelativePositionToOrigin(node.position)),
            "positionAbsolute": vector3ToJson(node.position),
            "center": vector_float3ToJson(planeAnchor.center),
            "extent": vector_float3ToJson(planeAnchor.extent)
        ];
    }
    func renderer(_ renderer: SCNSceneRenderer, didAdd node: SCNNode, for anchor: ARAnchor) {
        guard
            let a = anchor as? ARPlaneAnchor,
            let cb = onPlaneDetected
        else { return }
        cb(makePlaneDetectionResult(node, planeAnchor: a))
    }
    func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
        guard
            let a = anchor as? ARPlaneAnchor,
            let cb = onPlaneUpdate
        else { return }
        cb(makePlaneDetectionResult(node, planeAnchor: a))
    }
    func renderer(_ renderer: SCNSceneRenderer, didRemove node: SCNNode, for anchor: ARAnchor) {
        guard
        let a = anchor as? ARPlaneAnchor,
        let cb = onPlaneRemoved
        else { return }
        cb(makePlaneDetectionResult(node, planeAnchor: a))
    }
    var currentFrame: ARFrame? {
        get { return self.arView?.session.currentFrame }
    }
    func getCurrentLightEstimation() -> jsonType {
        guard let cf = currentFrame else { return [:]}
        return wrapLightEstimation(cf.lightEstimate)
    }
    func getCurrentDetectedFeaturePoints() -> [jsonType] {
        guard
            let cf = currentFrame,
            let rfp = cf.rawFeaturePoints,
            rfp.points.count > 0
        else { return []}
        var fps:[jsonType] = []
        for x in 1...rfp.points.count {
            let i = x - 1
            let v = rfp.points[i]
            let s = "featurepoint_" + String(i)
            let p = nodeManager.getRelativePositionToOrigin(SCNVector3(x: v[0], y: v[1], z: v[2]))
            var fp = vector3ToJson(p)
            fp["id"] = s
            fps.append(fp)
        }
        return fps
    }
    func session(_ session: ARSession, didUpdate frame: ARFrame) {
        nodeManager.didUpdateFrame(session: session, frame: frame)
        if let cb = onFeaturesDetected {
            let fps = getCurrentDetectedFeaturePoints()
            DispatchQueue(label:"RHDAR").async() {
                cb(["featurePoints": fps])
            }
        }
        if let cb = onLightEstimation, self.lightEstimationEnabled {
            DispatchQueue.main.async(){
                let e = self.getCurrentLightEstimation()
                cb(e)
            }
        }
    }
    func wrapLightEstimation(_ estimate: ARLightEstimate?) -> jsonType {
        guard let e = estimate else { return [:]}
        return [
            "ambientColorTemperature": e.ambientColorTemperature,
            "ambientIntensity": e.ambientIntensity
        ]
    }
    func session(_ session: ARSession, cameraDidChangeTrackingState camera: ARCamera) {
        guard let cb = onTrackingState else { return }
        DispatchQueue.main.async() {
            switch camera.trackingState {
                case .limited(let reason):
                    cb(["state": "limited", "reason": reason])
                default:
                    cb(["state": camera.trackingState])
            }
        }
    }
}
// MARK: - Utility Functions
func cropImageRect(_ image:UIImage, toRect: CGRect) -> UIImage {
    guard
        let cg = image.cgImage,
        let i = cg.cropping(to: toRect)
    else { return image }
    return UIImage(cgImage: i)
}
func radians(_ degrees:Double) -> CGFloat {
    return CGFloat(degrees * Double.pi / 180)
}
func rotate(_ src:UIImage, orientation:UIImageOrientation) -> UIImage {
    UIGraphicsBeginImageContext(src.size)
    guard let context = UIGraphicsGetCurrentContext() else { return src }
    var degrees:Double
    switch orientation {
        case UIImageOrientation.right:
            degrees = 90
        case UIImageOrientation.left:
            degrees = -90
        case UIImageOrientation.up:
            degrees = 90
        default:
            degrees = 0
    }
    context.rotate(by: radians(degrees))
    let i = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    if let x = i { return x }
    else { return src }
}
