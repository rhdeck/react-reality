import Foundation
@objc(ARPrimaryViewManager)
class RHDPrimaryViewManager : RCTViewManager {
    override func view() -> RHDPrimaryView {
        return (RHDPrimaryView()).start()
    }
    override class func requiresMainQueueSetup() -> Bool {
        return false
    }
}
