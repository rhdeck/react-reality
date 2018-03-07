import Foundation
import ARKit
@objc(RHDMonoView)
class RHDMonoview: UIView, ARSCNViewDelegate {
    var rscene: RHDSceneManager? = RHDSceneManager.sharedInstance
    var arview: ARSCNView?
    func start() -> RHDMonoview {
        if Thread.isMainThread {
            let a = ARSCNView()
            arview = a
            a.delegate = self
            if let sm = RHDSceneManager.sharedInstance {
                a.session.delegate = sm
                sm.scene = a.scene
                sm.session = a.session
                a.automaticallyUpdatesLighting = true
                a.autoenablesDefaultLighting = true
                addSubview(a)
                sm.doResume()
            }
        }
        
        return self
    }
    override func layoutSubviews() {
        super.layoutSubviews()
        arview?.frame = self.bounds
    }
    func handleTap(point: CGPoint, resolve:RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let v = arview else { reject("no_view", "No AR View", nil); return }
        print(point)
        let r = v.hitTest(point, options: nil)
        //let r = v.hitTest(point, types: .existingPlaneUsingExtent)
        let m = r.map() { h in
            return h.node.name
        }
        resolve(["nodes": m]);
    }
    
    
}
