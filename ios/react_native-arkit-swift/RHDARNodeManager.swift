import Foundation
import SceneKit
import ARKit
let focalDistance = 0.2
class RHDARNodeManager {
    var rootNode:SCNNode = SCNNode()
    var nodes: [String:SCNNode] = [:]
    var cameraOrigin = SCNNode()
    var localOrigin = SCNNode()
    var frontOfCamera = SCNNode()
    var cameraDirection = SCNVector3()
    var _arView:SCNView?
    static var sharedInstance = RHDARNodeManager()
    func setARView(_ arv:SCNView) {
        _arView = arv
        guard let s = arv.scene else { return }
        rootNode = s.rootNode
        rootNode.name = "root"
        rootNode.addChildNode(cameraOrigin)
        rootNode.addChildNode(localOrigin)
        rootNode.addChildNode(frontOfCamera)
    }
    func addNodeToScene(_ node:SCNNode, inReferenceFrame:String?) {
        let r =  inReferenceFrame ?? "Local"
        registerNode(node)
        switch r {
        case "Local":
            localOrigin.addChildNode(node)
        case "Camera":
            cameraOrigin.addChildNode(node)
        case "FrontOfCamera":
            frontOfCamera.addChildNode(node)
        default:
            //Do nothing
            print("Invalid value passed: " + r)
        }
    }
    func clear() {
        nodes.forEach() { k, v in
            v.removeFromParentNode()
        }
        nodes.removeAll()
    }
    func getSceneObjectsHitResult(_ point:CGPoint) -> jsonType {
        guard let a = _arView else { return [:] }
        let o = [SCNHitTestOption.rootNode: localOrigin, SCNHitTestOption.sortResults: true] as [SCNHitTestOption : Any]
        let r = a.hitTest(point, options:o)
        let mr = mapHitTestResultsWithSceneResults(r)
        return ["results": mr, "tapPoint": ["x": point.x, "y":point.y]]
    }
    func getRelativePositionToOrigin(_ v:SCNVector3) -> SCNVector3 {
        let o = localOrigin.position
        return SCNVector3(v.x - o.x, v.y - o.y, v.z - o.z)
    }
    func getAbsolutePositionToOrigin(_ v:SCNVector3) -> SCNVector3 {
        let o = localOrigin.position
        return SCNVector3(v.x + o.x, v.y + o.y, v.z + o.z)
    }
    func mapHitTestResultsWithSceneResults(_ results:[SCNHitTestResult]) -> [jsonType] {
        var out:[jsonType] = []
        results.forEach() { h in
            let n = h.node
            guard let id = self.findNodeId(n) else { return }
            let pa = h.worldCoordinates
            let p = self.getRelativePositionToOrigin(pa)
            let wn = h.worldNormal
            let d = self.getCameraDistanceToPoint(pa)
            out.append(["id": id,
                        "distance": d,
                        "positionAboslute": vector3ToJson(pa),
                        "position": vector3ToJson(p),
                        "normal": vector3ToJson(wn)
            ])
        }
        return out
    }
    func mapHitResults(_ results:[ARHitTestResult]) -> [jsonType] {
        var out:[jsonType] = []
        results.forEach() { result in
            let pa = vector_float4ToVector3(result.worldTransform.columns[3])
            let p = self.getRelativePositionToOrigin(pa)
            let d = self.getCameraDistanceToPoint(pa)
            out.append(["id": id,
                        "distance": d,
                        "positionAboslute": vector3ToJson(pa),
                        "position": vector3ToJson(p)
            ])
            
        }
        return out
    }
    func registerNode(_ node:SCNNode) {
        if let n = node.name { return registerNode(node, withName:n) }
        return registerNode(node, withName: UUID().uuidString)
    }
    func registerNode(_ node:SCNNode, withName:String) {
        removeNode(withName)
        nodes[withName] = node
    }
    func findNodeId(_ node:SCNNode) -> String? {
        var n:SCNNode? = node
        repeat {
            guard let nu = n  else { break }
            if let name = nu.name, let _ = nodes[name] {
                return name
            }
            n = nu.parent
        } while true
        return nil
    }
    func removeNode(_ key: String) {
        guard let n = nodes[key] else { return }
        nodes.removeValue(forKey: key)
        if let _ = n.light { n.isHidden = true }
        n.removeFromParentNode()
    }
    func updateNode(_ key:String, properties: jsonType) {
        guard let n = nodes[key] else { return }
        setNodeProperties(n, properties: properties)
        if let d = properties["shape"] as? jsonType, let g = n.geometry { setShapeProperties(g, properties: d) }
        if let d = properties["material"] as? jsonType, let g = n.geometry { g.materials.forEach() {m in
            setMaterialProperties(m, properties: d)
        }}
        if let l = n.light { setLightProperties(l, properties: properties)}
    }
    func getCameraDistanceToPoint(_ point: SCNVector3) -> Float {
        return getDistance(from: cameraOrigin.position, to: point)
    }
    func getDistance(from: SCNVector3, to: SCNVector3) -> Float {
        let xd = to.x - from.x
        let yd = to.y - from.y
        let zd = to.z - from.z
        let d = sqrt(pow(xd,2) + pow(yd,2) + pow(zd,2))
        return d
    }
    func didUpdateFrame(session: ARSession, frame: ARFrame) {
        let p = frame.camera.transform.columns[3]
        cameraOrigin.position = vector_float4ToVector3(p)
        let v = frame.camera.transform.columns[2]
        cameraDirection = SCNVector3(-v.x, -v.y, -v.z)
        cameraOrigin.eulerAngles = SCNVector3(0, atan2f(v.x, v.z), 0)
        frontOfCamera.position = SCNVector3(p.x - focalDistance * v.x , p.y - focalDistance * v.y, p.z - focalDistance * v.z)
        frontOfCamera.eulerAngles = self.cameraOrigin.eulerAngles
    }
}
