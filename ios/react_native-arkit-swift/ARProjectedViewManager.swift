
import Foundation
@objc(ARProjectedViewManager)
class ARProjectedViewManager: RCTViewManager {
    override func view() -> ARProjectedView {
        let v = ARProjectedView()
        return v
    }
    override class func requiresMainQueueSetup() -> Bool {
        return false
    }
}
