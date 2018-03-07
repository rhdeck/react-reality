import Foundation
import SceneKit

@objc(RHDSecondaryView)
class RHDSecondaryView: UIView {
    var view: SCNView?
    func start(node: SCNNode, scene: SCNScene) {
        let v = SCNView()
        view = v
        v.pointOfView = node;
        v.scene = scene
    }
    override func layoutSubviews() {
        super.layoutSubviews()
        view?.frame = self.bounds
    }
}
