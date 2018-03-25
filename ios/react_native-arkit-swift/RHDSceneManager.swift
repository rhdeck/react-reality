import Foundation
import SceneKit
import ARKit
@objc(RHDSceneManager)
class RHDSceneManager:RCTEventEmitter, ARSessionDelegate {
    static var sharedInstance:RHDSceneManager?
    override init() {
        super.init()
        if let s = RHDSceneManager.sharedInstance {
            s.listenedEvents = [:]
        }
        RHDSceneManager.sharedInstance = self
        configuration.planeDetection = .horizontal
    }
    var secondaryView:SCNView?
    var scene:SCNScene?
    var session:ARSession?
    var configuration:ARWorldTrackingConfiguration = ARWorldTrackingConfiguration()
    //MARK:Node Management
    var nodes:[String:SCNNode] = [:]
    var orphans:[String:[SCNNode]] = [:]
    func addNode(node: SCNNode, parent: String) {
        //Must have names or else we ditch
        guard let name = node.name else { return }
        nodes[name] = node
        if parent == "" {
            if let s = scene {
                s.rootNode.addChildNode(node)
                fixOrphans()
            } else {
                if let _ = orphans[""] {
                    orphans[""]!.append(node)
                } else {
                    orphans[""] = [node]
                }
            }
        } else if parent == "primebasenode" {
            if let pbn = primeBaseNode {
                pbn.addChildNode(node)
            } else {
                if let _ = orphans[parent] {
                    orphans[parent]!.append(node)
                } else {
                    orphans[parent] = [node]
                }
            }
        } else if let n = nodes[parent] {
            n.addChildNode(node)
            fixOrphans()
        } else {
            if let _ = orphans[parent] {
                orphans[parent]!.append(node)
            } else {
                orphans[parent] = [node]
            }
        }
    }
    var isFixingOrphans = false
    func fixOrphans() {
        guard !isFixingOrphans else { return }
        isFixingOrphans = true
        orphans.forEach() {parentid, ns in
            if parentid == "" {
                guard let _ = scene else { return }
                let nns = ns
                orphans.removeValue(forKey: parentid)
                nns.forEach() { node in
                    addNode(node: node, parent: parentid)
                }
            } else if parentid == "primebasenode" {
                if let _ = primeBaseNode {
                    let nns = ns
                    orphans.removeValue(forKey: parentid)
                    nns.forEach() { node in
                        addNode(node: node, parent: parentid)
                    }
                }
            }
            else if let _ = nodes[parentid] {
                let nns = ns
                orphans.removeValue(forKey: parentid)
                nns.forEach() { node in
                    addNode(node: node, parent: parentid)
                }
            }
        }
        isFixingOrphans = false
    }
    func removeNode(id: String) {
        guard let n = nodes[id] else { return }
        removeNode(node: n)
    }
    func removeNode(node: SCNNode) {
        node.removeFromParentNode()
        if let n  = node.name {
            nodes.removeValue(forKey: n)
        }
        node.childNodes.forEach() { cn in
            removeNode(node: cn)
        }
    }
    @objc func addNode(_ node:SCNNode, parentID: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        addNode(node: node, parent: parentID);
        resolve(true)
    }
    @objc func removeNode(_ id: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        removeNode(id: id)
        resolve(true)
    }
    @objc func updateNode(_ forNode: String, newProps: jsonType, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "No Node with name " + forNode, nil); return }
        setNodeProperties(n, properties: newProps)
    }
    @objc func setBox(_ g: SCNBox, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setGeometry(g, forNode: forNode, resolve: resolve, reject: reject);
    }
    @objc func setCapsule(_ g: SCNCapsule, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setGeometry(g, forNode: forNode, resolve: resolve, reject: reject);
    }
    @objc func setCone(_ g: SCNCone, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setGeometry(g, forNode: forNode, resolve: resolve, reject: reject);
    }
    @objc func setCylinder(_ g: SCNCylinder, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setGeometry(g, forNode: forNode, resolve: resolve, reject: reject);
    }
    @objc func setPlane(_ g: SCNPlane, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setGeometry(g, forNode: forNode, resolve: resolve, reject: reject);
    }
    @objc func setPyramid(_ g: SCNPyramid, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setGeometry(g, forNode: forNode, resolve: resolve, reject: reject);
    }
    @objc func setSphere(_ g: SCNSphere, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setGeometry(g, forNode: forNode, resolve: resolve, reject: reject);
    }
    @objc func setText(_ g: SCNText, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setGeometry(g, forNode: forNode, resolve: resolve, reject: reject);
    }
    @objc func setTorus(_ g: SCNTorus, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setGeometry(g, forNode: forNode, resolve: resolve, reject: reject);
    }
    @objc func setTube(_ g: SCNTube, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setGeometry(g, forNode: forNode, resolve: resolve, reject: reject);
    }
    @objc func setGeometry(_ geometry: SCNGeometry, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "No Node with name " + forNode, nil); return }
        n.geometry = geometry;
        resolve(true)
    }
    @objc func setMaterial(_ material:SCNMaterial, forNode: String, atPosition: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("At position " + String(atPosition))
        guard let n = nodes[forNode] else { reject("no_node", "No Node with name " + forNode, nil); return }
        guard let g = n.geometry else { reject("no_geometry", "No Geometry at node with name " + forNode, nil); return }
        if g.materials.count > atPosition {
            g.replaceMaterial(at: atPosition, with: material)
        } else if g.materials.count == atPosition {
            g.materials.append(material)
        } else {
            while g.materials.count < atPosition  {
                g.materials.append(SCNMaterial())
            }
            g.materials.append(material)
        }
    }
    @objc func setMaterialProperty(_ json: jsonType, propertyName: String, forMaterialAtPosition: Int, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "No Node with name " + forNode, nil); return }
        guard let g = n.geometry else { reject("no_geometry", "No Geometry at node with name " + forNode, nil); return }
        guard forMaterialAtPosition < g.materials.count else { reject("no_matieral", "No Material set at position " + String(forMaterialAtPosition) + "for node with name " + forNode, nil); return }
        let m = g.materials[forMaterialAtPosition]
        var mp:SCNMaterialProperty = SCNMaterialProperty()
        switch(propertyName) {
        case "diffuse":
             mp = m.diffuse
        case "specular":
             mp = m.specular
        case "normal":
             mp = m.normal
        default:
            reject("invalid_property", "Not a valid material property: " + propertyName, nil)
            return
        }
        setMaterialPropertyContents(json, materialProperty: mp)
        resolve(true) 
    }
    @objc func removeGeometry(_ forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "No Node with name " + forNode, nil); return }
        n.geometry = nil
        resolve(true)
    }
    @objc func removeMaterial(_ forNode: String, atPosition: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "No Node with name " + forNode, nil); return }
        guard let g = n.geometry else { reject("no_geometry", "No Geometry at node with name " + forNode, nil); return }
        g.removeMaterial(at: atPosition)
        resolve(true)
    }
    //MARK:SKNode Functions
    var SKNodes:[String:SKNode] = [:]
    var SKOrphans:[String:[SKNode]] = [:]
    var SKScenes:[String:Int] = [:]
    @objc func addSKSceneReference(_ scene: SKScene, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        addSKNode(scene, toParent: "")
        resolve(true)
    }
    @objc func addSKSceneByReference(_ sceneName: String, forNode: String, atPosition: Int, withType: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let scene = SKNodes[sceneName] as? SKScene else { reject("no_scene", "No Scene with Name: " + sceneName, nil); return}
        addSKScene(scene, forNode: forNode, atPosition: atPosition, withType: withType, resolve: resolve, reject: reject)
    }
    @objc func addSKScene(_ scene:SKScene, forNode: String, atPosition: Int, withType: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "No Node with name " + forNode, nil); return }
        guard let g = n.geometry else { reject("no_geometry", "No Geometry at node with name " + forNode, nil); return }
        let m = g.materials[atPosition]
        var mp:SCNMaterialProperty
        switch(withType) {
        case "diffuse":
            mp = m.diffuse
        case "normal":
            mp = m.normal
        case "specular":
            mp = m.specular
        default:
            reject("invalid_materialproperty", "Invalid Matieral Property Type: " + withType, nil)
            return
        }
        if let sksname = scene.name {
            if let count = SKScenes[sksname] {
                SKScenes[sksname] = count + 1
                if let s = SKNodes[sksname] {
                    mp.contents = s
                    addSKNode(s, toParent: "")
                } else {
                    mp.contents = scene
                    addSKNode(scene, toParent: "")
                }
            } else {
                SKScenes[sksname] = 1
                addSKNode(scene, toParent: "")
                mp.contents = scene
            }
        } else {
            addSKNode(scene, toParent: "")
            mp.contents = scene
        }
    }
    @objc func setSKLabelNode(_ node: SKLabelNode, toParent: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setSKNode(node, toParent: toParent, resolve: resolve, reject: reject)
    }
    @objc func updateSKLabelNode(_ json: jsonType, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard  let s = json["name"] as? String, let n = SKNodes[s] as? SKLabelNode else { reject("no_node", "No node with this name", nil); return }
        doUpdateSKLabelNode(n, json: json)
        resolve(true)
        
    }
    @objc func setSKNode(_ node: SKNode, toParent: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if let s = node.name, let o = SKNodes[s], let os = o.name {
            removeSKNode(os)
        }
        addSKNode(node, toParent: toParent);
        resolve(true)
    }
    func addSKNode(_ node: SKNode, toParent: String) {
        if let n = node.name {
            SKNodes[n] = node
        }
        if toParent == "" {
            fixSKOrphans()
        } else if let p = SKNodes[toParent] {
            p.addChild(node)
            fixSKOrphans()
            
        } else {
            if let _ = SKOrphans[toParent] {
                SKOrphans[toParent]?.append(node)
            } else {
                SKOrphans[toParent] = [node]
            }
        }
    }
    @objc func removeSKNode(_ name: String, resolve:RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        removeSKNode(name)
        
    }
    func removeSKNode(_ name:String) {
        if let n = SKNodes[name] {
            if let _ = n.parent {
                n.removeFromParent()
            }
            SKNodes.removeValue(forKey: name)
            for c:SKNode in n.children {
                if let s = c.name {
                    removeSKNode(s)
                }
            }
        }
    }
    @objc func removeSKScene(_ forNode: String, atPosition: Int, withType: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "No Node with name " + forNode, nil); return }
        guard let g = n.geometry else { reject("no_geometry", "No Geometry at node with name " + forNode, nil); return }
        let m = g.materials[atPosition]
        var mp:SCNMaterialProperty
        switch(withType) {
        case "diffuse":
            mp = m.diffuse
        case "normal":
            mp = m.normal
        case "specular":
            mp = m.specular
        default:
            reject("invalid_materialproperty", "Invalid Matieral Property Type: " + withType, nil)
            return
        }
        guard let sks = mp.contents as? SKScene else { reject("no_scene", "No scene present", nil); return }
        mp.contents = nil
        if let sksname = sks.name, let base = SKScenes[sksname] {
            SKScenes[sksname] = base - 1
            if SKScenes[sksname] == 0 {
                removeSKNode(sksname)
            }
        }
    }
    var isFixingSKOrphans = false
    func fixSKOrphans() {
        if isFixingSKOrphans { return }
        isFixingSKOrphans = true
        SKOrphans.forEach() { parentID, nodes in
            if let _ = SKNodes[parentID] {
                nodes.forEach() { node in
                    addSKNode(node, toParent: parentID)
                }
                SKOrphans[parentID] = nil
            }
        }
        isFixingSKOrphans = false
    }
    //MARK:Deprecated SKNode Functions
    @objc func addSKLabelNode(_ node: SKLabelNode, toParent: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        addSKNode(node, toParent: toParent, resolve: resolve, reject: reject)
    }
    
    @objc func addSKNode(_ node: SKNode, toParent: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        addSKNode(node, toParent: toParent)
        resolve(true)
    }
    //MARK:Session Management
    @objc func clear(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let s = scene else { reject("no_scene", "No scene is loaded", nil); return }
        s.rootNode.childNodes.forEach() { cn in
            cn.removeFromParentNode()
        }
        nodes = [:]
        resolve(true)
    }
    @objc func resume(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let _ = session else { reject("no_session", "No session loaded", nil); return }
        doResume()
        resolve(true)
    }
    func doResume() {
        guard let s = session else { return }
        s.run(configuration)
        fixOrphans()
    }
    @objc func pause(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let s = session else { reject("no_session", "No session is loaded", nil); return }
        s.pause()
        resolve(true)
    }
    //MARK:RCTBridgeModule methods
    override func constantsToExport() -> [AnyHashable : Any]! {
        //Exporting type/enum constants
        let out:[AnyHashable:Any] =  [
            "ARHitTestResultType": [
                "FeaturePoint": ARHitTestResult.ResultType.featurePoint,
                "EstimatedHorizontalPlane": ARHitTestResult.ResultType.estimatedHorizontalPlane,
                "ExistingPlane": ARHitTestResult.ResultType.existingPlane,
                "ExistingPlaneUsingExtent": ARHitTestResult.ResultType.existingPlaneUsingExtent
            ],
            "LightingModel": [
                "Constant": SCNMaterial.LightingModel.constant,
                "Blinn": SCNMaterial.LightingModel.blinn,
                "Lambert": SCNMaterial.LightingModel.lambert,
                "Phong": SCNMaterial.LightingModel.phong,
                "PhysicallyBased": SCNMaterial.LightingModel.physicallyBased
            ],
            "LightType":[
                "Ambient": SCNLight.LightType.ambient,
                "Directional": SCNLight.LightType.directional,
                "Omni": SCNLight.LightType.omni,
                "Probe": SCNLight.LightType.probe,
                "Spot": SCNLight.LightType.spot,
                "IES": SCNLight.LightType.IES
            ],
            "ShadowMode":[
                "Forward": SCNShadowMode.forward,
                "Deferred": SCNShadowMode.deferred,
                "ModeModulated": SCNShadowMode.modulated
            ],
            "ColorMask":[
                "All": SCNColorMask.all,
                "None": 0,
                "Alpha": SCNColorMask.alpha,
                "Blue": SCNColorMask.blue,
                "Red": SCNColorMask.red,
                "Green": SCNColorMask.green
            ],
            "ShaderModifierEntryPoint":[
                "Geometry": SCNShaderModifierEntryPoint.geometry,
                "Surface": SCNShaderModifierEntryPoint.surface,
                "LightingModel": SCNShaderModifierEntryPoint.lightingModel,
                "Fragment": SCNShaderModifierEntryPoint.fragment
            ],
            "BlendMode":[
                "Alpha": SCNBlendMode.alpha,
                "Add": SCNBlendMode.add,
                "Subtract": SCNBlendMode.subtract,
                "Multiply": SCNBlendMode.multiply,
                "Screen": SCNBlendMode.screen,
                "Replace": SCNBlendMode.replace
            ],
            "ChamferMode":[
                "Both": SCNChamferMode.both,
                "Back": SCNChamferMode.back,
                "Front": SCNChamferMode.front
            ],
            "ARWorldAlignment":[
                "Gravity": ARWorldTrackingConfiguration.WorldAlignment.gravity,
                "GravityAndHeading": ARWorldTrackingConfiguration.WorldAlignment.gravityAndHeading,
                "Camera": ARWorldTrackingConfiguration.WorldAlignment.camera
            ],
            "FillMode":[
                "Fill": SCNFillMode.fill,
                "Lines": SCNFillMode.lines
            ]
        ]
        return out
    }
    override class func requiresMainQueueSetup() -> Bool {
        return false
    }
    //MARK:ARSessionDelegate Methods
    func session(_ session: ARSession, didFailWithError error: Error) {
        //Is there someone paying attention to this?
        doSendEvent("ARSessionError", message: RCTJSErrorFromNSError(error))
    }
    //MARK:RCTEventEmitter Methods
    override func supportedEvents() -> [String]! {
        return [
        "ARSessionError"
        ]
    }
    func doSendEvent(_ key: String, message:Any?) {
        guard let l = listenedEvents[key], l > 0 else { return }
        sendEvent(withName: key, body: message)
    }
    var listenedEvents:[String:Int] = [:]
    override func addListener(_ eventName: String!) {
        if let val = listenedEvents[eventName] {
            listenedEvents[eventName] = val + 1
        } else {
            listenedEvents[eventName] = 1
        }
    }
    override func removeListeners(_ count: Double) {
        // Kill off all my listeners please
        listenedEvents = [:]
    }
    //MARK:ARAnchor delegate methods
    func addAnchor(_ anchor: ARAnchor, withNode: SCNNode) {
        guard let pa = anchor as? ARPlaneAnchor else { return }
        let width = CGFloat(pa.extent.x)
        let height = CGFloat(pa.extent.z)
        let plane = SCNPlane(width: width, height: height)
        plane.materials.first?.diffuse.contents = UIColor(displayP3Red: 0.9, green: 0.9, blue: 1, alpha: 0.5)
        let planeNode = SCNNode(geometry: plane)
        let planeParent = SCNNode()
        let x = CGFloat(pa.center.x)
        let y = CGFloat(pa.center.y)
        let z = CGFloat(pa.center.z)
        print("Plane node centroid")
        print(pa.center)
        print("node position")
        print(withNode.position)
        planeParent.position = SCNVector3(x,y,z)
        planeNode.eulerAngles.x = -.pi / 2
        planeParent.addChildNode(planeNode)
        withNode.addChildNode(planeParent)
        baseNodes[pa.identifier.uuidString] = planeNode
        updateBaseNode(pa.identifier.uuidString, withNode:planeParent)
    }
    func updateAnchor(_ anchor:ARAnchor, withNode: SCNNode) {
        guard
            let pa = anchor as? ARPlaneAnchor,
            let n = withNode.childNodes.first,
            let pn = n.childNodes.first,
            let g = pn.geometry as? SCNPlane
        else { return }
        let id = pa.identifier.uuidString
        let width = CGFloat(pa.extent.x)
        let height = CGFloat(pa.extent.z)
        g.width = width
        g.height = height
        let x = CGFloat(pa.center.x)
        let y = CGFloat(pa.center.y)
        let z = CGFloat(pa.center.z)
        n.position = SCNVector3(x, y, z)
        updateBaseNode(id, withNode: n);
    }
    var primeBaseNode:SCNNode?
    var primeBaseID:String = ""
    var baseNodes:[String:SCNNode] = [:]
    func updateBaseNode(_ id:String, withNode:SCNNode) {

        baseNodes[id] = withNode
        if primeBaseNode == nil {
            primeBaseNode = withNode
            primeBaseID = id
        }
        fixOrphans()
    }
    @available(iOS 11.3, *)
    @objc func addRecognizerImage(_ url:String, name: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let i = UIImage(contentsOfFile: url) else { reject("no_image", "could not get image from " + url, nil); return }
        guard let ci = i.cgImage else { reject("no_image", "Could not get CGImage instance from url " + url, nil); return }
        let x = ARReferenceImage(ci, orientation: CGImagePropertyOrientation.up, physicalWidth: 0.2)
        x.name = name
        if configuration.detectionImages == nil { configuration.detectionImages = [x] }
        else { configuration.detectionImages!.insert(x) }
    }
    @available(iOS 11.3, *)
    @objc func removeRecognizerImage(_ name: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard var d = configuration.detectionImages else { reject("no_images", "No recognized images registered", nil); return }
        let ims = d.filter() { im in
            return im.name == name
        }
        guard ims.count > 0 else { reject("no_matches", "No recognized images matching " + name, nil); return }
        ims.forEach() { im in
            d.remove(im)
        }
        configuration.detectionImages = d
        resolve(true)
    }
}
