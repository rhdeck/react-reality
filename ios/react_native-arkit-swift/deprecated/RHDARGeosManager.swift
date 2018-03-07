import Foundation
import SceneKit
import SpriteKit
@objc(RHDARGeosManager)
class RHDARGeosManager: NSObject {
    @objc
    func addNode(_ node:SCNNode, parent: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: parent)
        resolve(node.name)
    }
    @objc
    func addBox(_ geometry: SCNBox, nodeid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let node = RHDARNodeManager.sharedInstance.nodes[nodeid] else { reject("Could not find node", nil, nil); return }
        node.geometry = geometry
        resolve(true)
    }
    @objc
    func addSphere(_ geometry: SCNSphere, nodeid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let node = RHDARNodeManager.sharedInstance.nodes[nodeid] else { reject("Could not find node", nil, nil); return }
        node.geometry = geometry
        resolve(true)
    }
    @objc
    func addCylinder(_ geometry: SCNCylinder, nodeid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let node = RHDARNodeManager.sharedInstance.nodes[nodeid] else { reject("Could not find node", nil, nil); return }
        node.geometry = geometry
        resolve(true)
    }
    @objc
    func addCone(_ geometry: SCNCone, nodeid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let node = RHDARNodeManager.sharedInstance.nodes[nodeid] else { reject("Could not find node", nil, nil); return }
        node.geometry = geometry
        resolve(true)
    }
    @objc
    func addTorus(_ geometry: SCNTorus, nodeid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let node = RHDARNodeManager.sharedInstance.nodes[nodeid] else { reject("Could not find node", nil, nil); return }
        node.geometry = geometry
        resolve(true)
    }
    @objc
    func addPyramid(_ geometry: SCNPyramid, nodeid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let node = RHDARNodeManager.sharedInstance.nodes[nodeid] else { reject("Could not find node", nil, nil); return }
        node.geometry = geometry
        resolve(true)
    }
    @objc
    func addTube(_ geometry: SCNTube, nodeid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let node = RHDARNodeManager.sharedInstance.nodes[nodeid] else { reject("Could not find node", nil, nil); return }
        node.geometry = geometry
        resolve(true)
    }
    @objc
    func addPlane(_ geometry: SCNPlane, nodeid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let node = RHDARNodeManager.sharedInstance.nodes[nodeid] else { reject("Could not find node", nil, nil); return }
        node.geometry = geometry
        resolve(true)
    }
    @objc
    func addShape(_ geometry: SCNShape, nodeid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let node = RHDARNodeManager.sharedInstance.nodes[nodeid] else { reject("Could not find node", nil, nil); return }
        node.geometry = geometry
        resolve(true)
    }
    @objc
    func addLight(_ light: SCNLight, nodeid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let node = RHDARNodeManager.sharedInstance.nodes[nodeid] else { reject("Could not find node", nil, nil); return }

        node.light = light
        resolve(true)
    }
    @objc func removeNode(_ nodeid:String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let _ = RHDARNodeManager.sharedInstance.nodes[nodeid] else { reject("Could not find node", nil, nil); return }
        RHDARNodeManager.sharedInstance.removeNode(nodeid)
        resolve(true)
    }
    @objc func updateNode(_ nodeid:String, properties: jsonType, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        RHDARNodeManager.sharedInstance.updateNode(nodeid, properties:properties)
    }
    @objc func addSpriteText(_ text: String, nodeid: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let node = RHDARNodeManager.sharedInstance.nodes[nodeid] else { reject("Could not find node", nil, nil); return }
        guard let g = node.geometry  as? SCNPlane else { reject("No geometry at this node",nil,nil); return }
        let m = SCNMaterial();
        let gw = g.width
        let gh = g.height
        let whr = gw / gh
        var sw:CGFloat = 500, sh:CGFloat = 500 / whr
        if whr < 1 {
            sw = 500 * whr
            sh = 500
        }
        let s = SKScene(size:CGSize(width: sw, height: sh))
        //s.backgroundColor = UIColor.yellow
        s.backgroundColor = UIColor(white: 1, alpha: 0)
        let t = SKLabelNode(text: text);
        t.fontSize = sw / 5
        t.setScale(1)
        t.color = UIColor.red
        
        t.fontColor = UIColor.red
        t.fontName  = "Arial-BoldMT"
        s.scaleMode = SKSceneScaleMode.aspectFit
        
        t.position = CGPoint(x:sw/2, y:sh/2)
        s.addChild(t)
        m.diffuse.contentsTransform = SCNMatrix4Translate(SCNMatrix4MakeScale(1,-1,1), 0,1,0)
        m.diffuse.contents = s;
        g.materials.removeAll()
        g.materials.append(m)
    }
}
