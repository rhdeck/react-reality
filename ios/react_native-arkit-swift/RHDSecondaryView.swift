import Foundation
import SceneKit

@objc(ARSecondaryView)
class ARSecondaryView: UIView {
    var sview: SCNView?
    var isStarted:Bool = false
   
    func start() -> ARSecondaryView {
        guard !isStarted else { return self }
        if Thread.isMainThread {
            guard let sm = ARSceneManager.sharedInstance else { return self }
            let v = SCNView()
            sview = v
            v.scene = sm.scene
            v.isPlaying = true
            v.autoenablesDefaultLighting = true
            sm.secondaryView = v
            addSubview(v)
            isStarted = true
        } else {
            DispatchQueue.main.async() {
                let _ = self.start()
            }
        }
        return self
    }
    override func layoutSubviews() {
        super.layoutSubviews()
        guard let v = sview else { return }
        v.frame = self.bounds
    }
}
