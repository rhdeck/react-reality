import Foundation
@objc(ARProjectedView)
class ARProjectedView: UIView {
    var _parentNode:String?
    @objc var parentNode:String? {
        get { return _parentNode }
        set(newNode) {
            _parentNode = newNode
            guard let s = ARSceneManager.sharedInstance else { return }
            s.registerView(newNode, view: self)
        }
    }
}
