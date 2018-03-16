import Foundation
import ARKit

@objc(RHDPrimaryView)
class RHDPrimaryView: UIView, ARSCNViewDelegate {
    var arview: ARSCNView?
    var onStart:RCTBubblingEventBlock?
    @objc var interPupilaryDistance:Float = 0.066
    func start() -> RHDPrimaryView {
        if Thread.isMainThread {
            let a = ARSCNView()
            arview = a
            a.delegate = self
            guard let sm = RHDSceneManager.sharedInstance else { return self }
            a.session.delegate = sm
            sm.scene = a.scene
            sm.session = a.session
            a.scene.background.contents = UIColor.black
            a.autoenablesDefaultLighting = true
            addSubview(a)
            sm.doResume()
        } else {
            DispatchQueue.main.async(){
                let _ = self.start();
            }
        }
        return self
    }
    override func layoutSubviews() {
        super.layoutSubviews()
        arview?.frame = self.bounds
        
    }
    
    func renderer(_ renderer: SCNSceneRenderer, updateAtTime time: TimeInterval) {
        DispatchQueue.main.async() {
            guard
                let sm = RHDSceneManager.sharedInstance,
                let sv = sm.secondaryView,
                let pv = self.arview,
                let pointOfView = pv.pointOfView?.clone()
            else { return }
            // Determine Adjusted Position for Right Eye
            let orientation : SCNQuaternion = pointOfView.orientation
            let orientationQuaternion : GLKQuaternion = GLKQuaternionMake(orientation.x, orientation.y, orientation.z, orientation.w)
            let eyePos : GLKVector3 = GLKVector3Make(1.0, 0.0, 0.0)
            let rotatedEyePos : GLKVector3 = GLKQuaternionRotateVector3(orientationQuaternion, eyePos)
            let rotatedEyePosSCNV : SCNVector3 = SCNVector3Make(rotatedEyePos.x, rotatedEyePos.y, rotatedEyePos.z)
            pointOfView.position.x += rotatedEyePosSCNV.x * self.interPupilaryDistance
            pointOfView.position.y += rotatedEyePosSCNV.y * self.interPupilaryDistance
            pointOfView.position.z += rotatedEyePosSCNV.z * self.interPupilaryDistance
            // Set PointOfView for SecondView
            sv.pointOfView = pointOfView
        }
    }
    func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
        guard let scene = RHDSceneManager.sharedInstance else { return }
        scene.updateAnchor(anchor, withNode: node)
    }
    func renderer(_ renderer: SCNSceneRenderer, didAdd node: SCNNode, for anchor: ARAnchor) {
        guard let scene = RHDSceneManager.sharedInstance else { return }
        scene.addAnchor(anchor, withNode: node)

    }
    
}
