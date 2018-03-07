import Foundation
//@rn view=RHDMonoview
@objc(RHDMonoViewManager)
class RHDMonoviewManager:RCTViewManager {
    var v: RHDMonoview?
    override func view() -> RHDMonoview {
        v = (RHDMonoview()).start()
        return v!
    }
    func requiresMainQueueSetup() -> Bool {
        return true
    }
    @objc func doTap(_ x: Double, y: Double, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("doTap x: " + String(x) + " y: " + String(y))
        guard let v = self.v else { reject("no_view", "No View loaded", nil); return }
        v.handleTap(point: CGPoint(x: CGFloat(x), y: CGFloat(y)), resolve:resolve, reject: reject)
    }
}
