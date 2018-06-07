import Foundation
@objc(ARMonoViewManager)
class ARMonoviewManager:RCTViewManager {
    var v: ARMonoview?
    override func view() -> ARMonoview {
        v = (ARMonoview()).start()
        return v!
    }
    override class func requiresMainQueueSetup() -> Bool {
        return false
    }
    @objc func doTap(_ x: Double, y: Double, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let v = self.v else { reject("no_view", "No View loaded", nil); return }
        v.handleTap(point: CGPoint(x: CGFloat(x), y: CGFloat(y)), resolve:resolve, reject: reject)
    }
}
