import Foundation
@objc(ARSecondaryViewManager)
class ARSecondaryViewManager : RCTViewManager {
    override func view() -> ARSecondaryView {
        return (ARSecondaryView()).start()
    }
    override class func requiresMainQueueSetup() -> Bool {
        return false
    }
}
