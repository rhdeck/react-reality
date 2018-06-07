import Foundation
@objc(ARPrimaryViewManager)
class ARPrimaryViewManager : RCTViewManager {
    override func view() -> ARPrimaryView {
        return (ARPrimaryView()).start()
    }
    override class func requiresMainQueueSetup() -> Bool {
        return false
    }
}
