import Foundation
@objc(ARSecondaryViewManager)
class RHDSecondaryViewManager : RCTViewManager {
    override func view() -> RHDSecondaryView {
        return (RHDSecondaryView()).start()
    }
    override class func requiresMainQueueSetup() -> Bool {
        return false
    }
}
