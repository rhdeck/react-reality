import Foundation
@objc(RHDPrimaryViewManager)
class RHDPrimaryViewManager : RCTViewManager {
    override func view() -> RHDPrimaryView {
        return (RHDPrimaryView()).start()
    }
    override class func requiresMainQueueSetup() -> Bool {
        return false
    }
}
