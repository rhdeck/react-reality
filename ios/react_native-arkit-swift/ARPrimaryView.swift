import Foundation
import ARKit

@objc(ARPrimaryView)
class ARPrimaryView: UIView, ARSCNViewDelegate {
    var arview: ARSCNView?
    var pview: SCNView?
    var onStart:RCTBubblingEventBlock?
    @objc var interPupilaryDistance:Float = 0.066
    @objc var holoOffsetY: Float = 0.08
    @objc var holoOffsetZ: Float = -0.08
    @objc var holoOffsetX: Float = 0.033
    @objc var fieldOfView: Float = 60
    func start() -> ARPrimaryView {
        if Thread.isMainThread {
            let a = ARSCNView()
            let p = SCNView()
            pview = p
            p.scene = a.scene
            p.isPlaying = true
            p.autoenablesDefaultLighting = true
            arview = a
            a.delegate = self
            guard let sm = ARSceneManager.sharedInstance else { return self }
            a.session.delegate = sm
            sm.addScene(a.scene)
            sm.session = a.session
            p.backgroundColor = UIColor.yellow
            p.scene?.background.contents = UIColor.black
            a.autoenablesDefaultLighting = true
            addSubview(a)
            addSubview(p)
            sm.doResume()
            self.clipsToBounds = true
        } else {
            DispatchQueue.main.async(){
                let _ = self.start();
            }
        }
        return self
    }
    override func layoutSubviews() {
        super.layoutSubviews()
        pview?.frame = self.bounds
        arview?.frame = self.bounds
        arview?.isHidden = true
    }
    func renderer(_ renderer: SCNSceneRenderer, updateAtTime time: TimeInterval) {
        DispatchQueue.main.async() {
            guard
                let sm = ARSceneManager.sharedInstance,
                let sv = sm.secondaryView,
                let ppv = self.pview,
                let pv = self.arview,
                let PVpointOfView = pv.pointOfView?.clone()
            else { return }
           
            let orientation : SCNQuaternion = PVpointOfView.orientation
            let YPos = SCNQToSCN3(orientation, v:SCNVector3Make( 0, 1, 0))
            PVpointOfView.position = applyOffset(v: PVpointOfView.position, withV: YPos, byScalar: self.holoOffsetY)
            let ZPos = SCNQToSCN3(orientation, v: SCNVector3Make(0,0,1))
            PVpointOfView.position = applyOffset(v: PVpointOfView.position, withV: ZPos , byScalar: self.holoOffsetZ)
            let XPos = SCNQToSCN3(orientation, v:SCNVector3Make( 1,  0,  0))
            PVpointOfView.position = applyOffset(v: PVpointOfView.position, withV: XPos, byScalar: self.holoOffsetX)
            PVpointOfView.camera?.fieldOfView = CGFloat(self.fieldOfView)
            ppv.pointOfView = PVpointOfView
             // Determine Adjusted Position for Right Eye
            let SVPointOfView = PVpointOfView.clone()
            SVPointOfView.position = applyOffset(v: SVPointOfView.position, withV: XPos, byScalar:1.0 * self.interPupilaryDistance)
            SVPointOfView.camera?.fieldOfView = CGFloat(self.fieldOfView)
            sv.pointOfView = SVPointOfView
            if let pov = renderer.pointOfView { sm.updatePOV(pov) }
        }
    }
    func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
        guard let scene = ARSceneManager.sharedInstance else { return }
        scene.updateAnchor(anchor, withNode: node)
    }
    func renderer(_ renderer: SCNSceneRenderer, didAdd node: SCNNode, for anchor: ARAnchor) {
        guard let scene = ARSceneManager.sharedInstance else { return }
        scene.addAnchor(anchor, withNode: node)

    }
    func renderer(_ renderer: SCNSceneRenderer, didRemove node: SCNNode, for anchor: ARAnchor) {
        guard let scene = ARSceneManager.sharedInstance else { return }
        scene.removeAnchor(anchor, withNode: node)
    }
}
func GLK3ToSCN3(_ g:GLKVector3) -> SCNVector3 {
    return SCNVector3Make(g.x, g.y, g.z)
}
func SCN3ToGLK3(_ s:SCNVector3) -> GLKVector3 {
    return GLKVector3Make(s.x, s.y, s.z)
}
func GQToSCN3(_ q: GLKQuaternion, v: GLKVector3) -> SCNVector3 {
    let gv = GLKQuaternionRotateVector3(q, v)
    return GLK3ToSCN3(gv)
}
func SCNQToGQ(_ q: SCNQuaternion) -> GLKQuaternion {
    return GLKQuaternionMake(q.x,  q.y,  q.z, q.w);
}
func SCNQToSCN3(_ q: SCNQuaternion, v: SCNVector3) -> SCNVector3 {
    let gq = SCNQToGQ(q)
    return GQToSCN3(gq, v: SCN3ToGLK3(v));
}
func applyOffset(v: SCNVector3, withV:SCNVector3, byScalar: Float) -> SCNVector3 {
    var v2 = SCNVector3Make(v.x, v.y, v.z)
    v2.x += withV.x * byScalar
    v2.y += withV.y * byScalar
    v2.z += withV.z * byScalar
    return v2
}
