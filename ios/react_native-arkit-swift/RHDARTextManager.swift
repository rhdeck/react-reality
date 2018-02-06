import Foundation
import SceneKit
@objc(RHDARTextManager)
class RHDARTextManager: NSObject {
    @objc func mount(_ textNode:SCNTextNode, node: SCNNode, frame: String) {
        node.addChildNode(textNode)
        RHDARNodeManager.sharedInstance.addNodeToScene(node, inReferenceFrame: frame)
    }
}
