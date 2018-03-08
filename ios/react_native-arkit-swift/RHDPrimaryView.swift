import Foundation
import ARKit

@objc(RHDPrimaryView)
class RHDPrimaryView: UIView, ARSCNViewDelegate {
    var arview: ARSCNView?
    var cameraNode: SCNNode?
    var secondaryView: RHDSecondaryView?
    func start() -> RHDPrimaryView {
        if Thread.isMainThread {
            let a = ARSCNView()
            arview = a
            a.delegate = self
            guard let sm = RHDSceneManager.sharedInstance else { return self }
            a.session.delegate = sm
            sm.scene = a.scene
            a.scene.background.contents = UIColor.black
            sm.primeCameraNode = a.pointOfView
            addSubview(a)
            sm.doResume()
        }
        return self
    }
    override func layoutSubviews() {
        super.layoutSubviews()
        arview?.frame = self.bounds
        
    }
    func renderer(_ renderer: SCNSceneRenderer, updateAtTime time: TimeInterval) {
        //Update the node
        guard let cameraNode = renderer.pointOfView, let v = arview else { return }
        if let s = secondaryView , s.view == nil {
            s.start(node: cameraNode, scene: v.scene)
        }
    }
}
