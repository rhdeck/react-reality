import Foundation
import SceneKit
@objc(RHDARGeosManager)
class RHDARGeosManager: NSObject {
    @objc func addBox(_ geometry:SCNBox, node:SCNNode, frame:String) {
        node.geometry = geometry
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: frame)
    }
    @objc func addSphere(_ geometry:SCNSphere, node:SCNNode, frame:String) {
        node.geometry = geometry
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: frame)
    }
    @objc func addCylinder(_ geometry:SCNCylinder, node:SCNNode, frame:String) {
        node.geometry = geometry
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: frame)
    }
    @objc func addCone(_ geometry:SCNCone, node:SCNNode, frame:String) {
        node.geometry = geometry
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: frame)
    }
    @objc func addPyramid(_ geometry:SCNPyramid, node:SCNNode, frame:String) {
        node.geometry = geometry
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: frame)
    } 
    @objc func addTube(_ geometry:SCNTube, node:SCNNode, frame:String) {
        node.geometry = geometry
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: frame)
    }
    @objc func addTorus(_ geometry:SCNTorus, node:SCNNode, frame:String) {
        node.geometry = geometry
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: frame)
    }
    @objc func addCapsule(_ geometry:SCNCapsule, node:SCNNode, frame:String) {
        node.geometry = geometry
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: frame)
    }
    @objc func addPlane(_ geometry:SCNPlane, node:SCNNode, frame:String) {
        node.geometry = geometry
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: frame)
    }
    @objc func addShape(_ geometry:SCNShape, node:SCNNode, frame:String) {
        node.geometry = geometry
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: frame)
    }
    @objc func addLight(_ light:SCNLight, node:SCNNode, frame:String) {
        node.light = light
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: frame)
    }
    @objc func unmount(_ identifier: String) {
        RHDARNodeManager.sharedInstance.removeNode(identifier) 
    }
    @objc func updateNode(_ identifier:String, properties: jsonType) {
        RHDARNodeManager.sharedInstance.updateNode(identifier, properties:properties)
    }
    
}
