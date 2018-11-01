import Foundation
import SceneKit
import SceneKit.ModelIO
import ARKit
import ModelIO
let PlaneDetection:[String:UInt] = [
    "horizontal": 1,
    "vertical": 2,
    "both": 3
]
@objc(ARSceneManager)
class ARSceneManager:RCTEventEmitter, ARSessionDelegate {
    static var sharedInstance:ARSceneManager?
    override init() {
        super.init()
        if let s = ARSceneManager.sharedInstance {
            s.listenedEvents = [:]
        }
        ARSceneManager.sharedInstance = self
    }
    var secondaryView:SCNView?
    var scene:SCNScene?
    func addScene(_ s: SCNScene) {
        scene = s
        if let sv = secondaryView {
            sv.scene = s
        }
    }
    var session:ARSession?
    var configuration:ARWorldTrackingConfiguration = ARWorldTrackingConfiguration()
    //MARK:Node Management
    var nodes:[String:SCNNode] = [:]
    var orphans:[String:[SCNNode]] = [:]
    var pv:ARSCNView?
    func addNode(node: SCNNode, parent: String) {
        //Must have names or else we ditch
        guard
            let name = node.name
        else { return }
        nodes[name] = node
        NSLog("Added node with name: " + name)
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
        } else if let baseNode = baseNodes[parent] {
            baseNode.addChildNode(node)
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
            } else if let _  = baseNodes[parentid] {
                let nns = ns
                orphans.removeValue(forKey: parentid)
                nns.forEach() { node in
                    addNode(node: node, parent: parentid)
                }
            } else if let _ = nodes[parentid] {
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
        guard let n = nodes[id], baseNodes[id] == nil else { return }
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
        guard let n = nodes[forNode] else { reject("no_node", "updateNode: No Node with name " + forNode, nil); return }
        setNodeProperties(n, properties: newProps)
        resolve(true)
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
    @objc func setShape(_ g: SCNShape, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setGeometry(g, forNode: forNode, resolve: resolve, reject: reject);

    }
    @objc func setGeometry(_ geometry: SCNGeometry, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "setGeometry:No Node with name " + forNode, nil); return }
        n.geometry = geometry;
        resolve(true)
    }
    @objc func setLight(_ light: SCNLight, forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "setGeometry:No Node with name " + forNode, nil); return }
        n.light = light
        resolve(true)
    }
    @objc func removeLight(_ forNode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "setGeometry:No Node with name " + forNode, nil); return }
        n.light = nil
        resolve(true)
    }
    @objc func setMaterial(_ material:SCNMaterial, forNode: String, atPosition: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "setMaterial:No Node with name " + forNode, nil); return }
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
        guard let n = nodes[forNode] else { reject("no_node", "setMaterialProperty:No Node with name " + forNode, nil); return }
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
        guard let n = nodes[forNode] else { reject("no_node", "removeGeometry:No Node with name " + forNode, nil); return }
        n.geometry = nil
        resolve(true)
    }
    @objc func removeMaterial(_ forNode: String, atPosition: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard atPosition > -1 else { reject("bad_position", "Position must be 0 or greater", nil); return}
        guard let n = nodes[forNode] else { reject("no_node", "removeMaterial:No Node with name " + forNode, nil); return }
        guard let g = n.geometry else { reject("no_geometry", "No Geometry at node with name " + forNode, nil); return }
        guard g.materials.count > atPosition else  { reject("bad_position", "Position is higher than allowed for this geometry", nil); return}
        g.removeMaterial(at: atPosition)
        resolve(true)
    }
    //MARK:SCNScene functions
    var loadedSceneStatus:[String:Bool] = [:]
    var loadedScenes:[String:SCNScene] = [:]
    func loadScene(sourcePath: String) {
        loadScene(sourcePath: sourcePath, successCB: {}) { x in }
    }
    func loadScene(sourcePath: String, successCB: ()->Void, errorCB: (Any)->Void) {
        guard loadedScenes[sourcePath] == nil else { successCB(); return; }
        loadedSceneStatus[sourcePath] = false;
        let url = URL(fileURLWithPath: sourcePath)
        loadedSceneStatus[sourcePath] = true
        if let s = try? SCNScene(url: url, options: nil) {
            loadedScenes[sourcePath] = s
            successCB()
        } else {
            loadedScenes[sourcePath] = nil
        }
    }
    func loadSceneAsync(sourcePath: String, successCB: @escaping ()->Void, errorCB: @escaping (Any)->Void) {
        DispatchQueue(label: "ARSceneLoader").async() {
            self.loadScene(sourcePath: sourcePath, successCB: successCB, errorCB: errorCB)
        }
    }
    func mountScene(targetNodeID: String, loadedSceneID: String, atChild: String) -> Bool{
        guard let n = nodes[targetNodeID] else { return false }
        guard let lm = loadedScenes[loadedSceneID] else { return false }
        guard let c = lm.rootNode.childNodes.first(where: {n in return n.name == atChild}) else { return false }
        n.addChildNode(c)
        return true
    }
    var loadedReferenceNodes:[String: SCNReferenceNode] = [:]
    var loadedReferenceNodeStatus:[String:Bool] = [:]
    func loadReferenceNode(sourcePath: String,successCB: ()->Void, errorCB: (Any)->Void) {
        guard loadedReferenceNodes[sourcePath] == nil else { successCB(); return }
        loadedReferenceNodeStatus[sourcePath] = false
        let url = URL(fileURLWithPath: sourcePath)
        guard let rn = SCNReferenceNode(url: url) else { errorCB("Cannot load reference node from url: " + url.absoluteString); return}
        rn.load()
        if(rn.isLoaded) {
            loadedReferenceNodes[sourcePath] = rn
            successCB()
            loadedReferenceNodeStatus[sourcePath] = true
        } else {
            errorCB("Could not load")
            loadedReferenceNodeStatus.removeValue(forKey: sourcePath)
        }
    }
    func mountReferenceNode(targetNodeID: String, referenceNodeID: String) -> Bool{
        guard let n = nodes[targetNodeID] else { return false }
        guard let rn = loadedReferenceNodes[referenceNodeID] else { return false }
        n.addChildNode(rn)
        return true
    }
    func loadReferenceNodeAsync(sourcePath: String, successCB: @escaping ()->Void, errorCB: @escaping (Any)->Void) {
        DispatchQueue(label: "ARReferenceNodes").async() {
            self.loadReferenceNode(sourcePath: sourcePath, successCB: successCB, errorCB: errorCB)
        }
    }
    @objc func setScene(_ forNode: String, sourcePath: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "addScene: No node with name " + forNode, nil); return}
        loadReferenceNodeAsync(sourcePath: sourcePath, successCB: {
            if let rn = self.loadedReferenceNodes[sourcePath] {
                n.addChildNode(rn)
                resolve(true)
            } else {
                reject("no_Scene", "Could not find a loaded Scene even though this was the success path", nil);
            }
        }) { message in
            if let messageString = message as? String {
                reject("setScene_fail", messageString, nil)
            } else {
                reject("setScene_fail", "SetScene failure: No further information", nil)
            }
        }
    }
    //MARK: MDL Functions
    var loadedModels:[String: MDLAsset] = [:]
    var loadedModelState:[String: Bool] = [:]
    func loadModel(_ sourcePath: String) -> Bool{
        guard loadedModels[sourcePath] == nil else { return true }
        loadedModelState[sourcePath] = false
        let u = URL(fileURLWithPath: sourcePath)
        let m:MDLAsset = MDLAsset(url: u)
        m.loadTextures() //Note this assumes that the loaded model is in the same directory as its dependent textures
        loadedModels[sourcePath] = m
        loadedModelState[sourcePath] = true
        return true
    }
    func loadSceneFromModel(_ sourcePath: String) -> Bool {
        guard let m = loadedModels[sourcePath] else { return false }
        loadedScenes[sourcePath] = SCNScene(mdlAsset: m)
        return true
    }
    @objc func setModel(_ forNode: String, sourcePath: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard loadModel(sourcePath) else { reject("no_model", "Could not load model from path " + sourcePath, nil); return }
        //guard loadSceneFromModel(sourcePath) else { reject("no_scene", "Could not convert model to scene from path " + sourcePath, nil); return }
        
        //setScene(forNode, sourcePath: sourcePath, resolve: resolve, reject: reject)
        //make a new node
        guard let n = nodes[forNode] else { reject("no_node", "No node found with name " + forNode, nil); return}
        let sn = SCNNode(mdlObject: loadedModels[sourcePath]!.object(at: 0)) 
        n.addChildNode(sn)
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
        guard let n = nodes[forNode] else { reject("no_node", "addSKScene: No Node with name " + forNode, nil); return }
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
        resolve(true)
    }
    @objc func updateSKScene(_ scene:jsonType, forNode: String, atPosition: Int, withType: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[forNode] else { reject("no_node", "addSKScene: No Node with name " + forNode, nil); return }
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
        if let thisScene = mp.contents as? SKScene {
            doUpdateSKScene(thisScene, json: scene)
            resolve(true)
        } else {
            reject("no_scene", "Did not find scene", nil)
        }
    }
    @objc func setSKLabelNode(_ node: SKLabelNode, toParent: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setSKNode(node, toParent: toParent, resolve: resolve, reject: reject)
    }
    @objc func updateSKLabelNode(_ json: jsonType, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let s = json["name"] as? String else { reject("no_name", "No Name specified for node", nil); return }
        guard let n = SKNodes[s] as? SKLabelNode else { reject("no_node", "No label node with this name " + s, nil); return }
        doUpdateSKLabelNode(n, json: json)
        resolve(true)
    }
    @objc func setSKVideoNode(_ node: SKVideoNode, toParent: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        setSKNode(node, toParent: toParent, resolve:resolve, reject:reject)
    }
    @objc func updateSKVideoNode(_ json: jsonType, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let s = json["name"] as? String else { reject("no_name", "No Name specified for node", nil); return }
        guard let n = SKNodes[s] as? SKVideoNode else { reject("no_node", "No video node with this name " + s, nil); return }
        doUpdateSKVideoNode(n, json: json)
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
            NSLog("Adding SKNode id " + n + " to parent " + toParent)
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
        guard let n = nodes[forNode] else { reject("no_node", "removeSKScene: No Node with name " + forNode, nil); return }
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
    //MARK: Animation Methods
    var animationDuration:CFTimeInterval = 0
    @objc func setAnimation(_ seconds: Double, type: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        animationDuration = seconds
        animationType = type
        updateAnimation()
        resolve(true)
    }
    @objc func setAnimationDuration(_ seconds: Double, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        animationDuration = seconds
        updateAnimation()
        resolve(true)
    }
    var animationType = "both"
    @objc func setAnimationType(_ type: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        animationType = type
        resolve(true)
    }
    func updateAnimation() {
        SCNTransaction.animationDuration = animationDuration
        var timingFunc:String = kCAMediaTimingFunctionEaseInEaseOut
        switch(animationType) {
        case "none": timingFunc = kCAMediaTimingFunctionLinear
        case "out": timingFunc = kCAMediaTimingFunctionEaseOut
        case "in": timingFunc = kCAMediaTimingFunctionEaseIn
        case "both": timingFunc = kCAMediaTimingFunctionEaseInEaseOut
        default: timingFunc = kCAMediaTimingFunctionEaseInEaseOut
        }
        SCNTransaction.animationTimingFunction = CAMediaTimingFunction(name: timingFunc)

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
    func session(_ session: ARSession, cameraDidChangeTrackingState camera: ARCamera) {
        doSendEvent("ARCameraState", message: { (tr: ARCamera.TrackingState) -> String in
            switch tr {
            case .limited:
                return "limited"
            case .normal:
                return "normal"
            case .notAvailable:
                return "notAvailable"
            }
        }(camera.trackingState))
    }
    //MARK:RCTEventEmitter Methods
    //@RNSEvent ARSessionError AREvent ARPlaneEvent ARImageEvent ARCameraState, ARPositionChange
    override func supportedEvents() -> [String]! {
        return [
        "ARSessionError",
        "ARPositionChange",
        "ARPlaneEvent",
        "ARImageEvent",
        "ARCameraState"
        ]
    }
    func doSendEvent(_ key: String, message:Any?) {
        guard let l = listenedEvents[key], l > 0 else { return }
        sendEvent(withName: key, body: message)
    }
    var listenedEvents:[String:Int] = [:]
    override func addListener(_ eventName: String!) {
        super.addListener(eventName)
        if let val = listenedEvents[eventName] {
            listenedEvents[eventName] = val + 1
        } else {
            listenedEvents[eventName] = 1
        }
    }
    override func removeListeners(_ count: Double) {
        super.removeListeners(count)
        // Kill off all my listeners please
        listenedEvents = [:]
    }
    //MARK:ARAnchor delegate methods
    var baseNodes:[String:SCNNode] = [:]
    var anchors:[String:jsonType] = [:]
    var anchorObjects: [String: ARAnchor] = [:]
    func addAnchor(_ anchor: ARAnchor, withNode: SCNNode) {
        anchorObjects[anchor.identifier.uuidString] = anchor
        if let pa = anchor as? ARImageAnchor { addImageAnchor(pa, withNode: withNode) }
        if let pa = anchor as? ARPlaneAnchor { addPlaneAnchor(pa, withNode: withNode) }
    }
    func updateAnchor(_ anchor:ARAnchor, withNode: SCNNode) {
        if let pa = anchor as? ARImageAnchor { updateImageAnchor(pa, withNode: withNode)}
        if let pa = anchor as? ARPlaneAnchor { updatePlaneAnchor(pa, withNode: withNode)}
    }
    func removeAnchor(_ anchor: ARAnchor, withNode: SCNNode) {
        anchorObjects.removeValue(forKey: anchor.identifier.uuidString)
        if let pa = anchor as? ARImageAnchor { removeImageAnchor(pa, withNode: withNode)}
        if let pa = anchor as? ARPlaneAnchor { removePlaneAnchor(pa, withNode: withNode)}
    }
    func addPlaneAnchor(_ anchor: ARPlaneAnchor, withNode: SCNNode) {
        let id = anchor.identifier.uuidString
        let width = CGFloat(anchor.extent.x)
        let height = CGFloat(anchor.extent.z)
        let position = vector3ToJson(withNode.position)
        let eulerAngles = vector3ToJson(withNode.eulerAngles)
        let orientation = vector4ToJson(withNode.orientation)
        let worldPosition = vector3ToJson(withNode.worldPosition)
        let worldOrientation = vector4ToJson(withNode.worldOrientation)
        
        baseNodes[id] = withNode
        let alignment:String = anchor.alignment == .horizontal ? "horizontal": "vertical"
        anchors[id] = ["type": "plane",  "plane": ["width": width, "height":height,"alignment": alignment, "position": position, "eulerAngles": eulerAngles, "orientation": orientation, "worldPosition": worldPosition, "worldOrientation": worldOrientation ]];
        doSendEvent("ARPlaneEvent", message: ["key": "planeAnchorAdded", "data": ["id": id, "action":"add", "anchor": anchors[id]]])
        fixOrphans()
    }
    func updatePlaneAnchor(_ anchor:ARPlaneAnchor, withNode: SCNNode) {
        let id = anchor.identifier.uuidString
        let width = CGFloat(anchor.extent.x)
        let height = CGFloat(anchor.extent.z)
        let position = vector3ToJson(withNode.position)
        let eulerAngles = vector3ToJson(withNode.eulerAngles)
        let orientation = vector4ToJson(withNode.orientation)
        let worldPosition = vector3ToJson(withNode.worldPosition)
        let worldOrientation = vector4ToJson(withNode.worldOrientation)
        
        let alignment:String = anchor.alignment == .horizontal ? "horizontal": "vertical"
        anchors[id] = ["type": "plane",  "plane": ["width": width, "height":height,"alignment": alignment, "position": position, "eulerAngles": eulerAngles, "orientation": orientation, "worldPosition": worldPosition, "worldOrientation": worldOrientation ]];
        doSendEvent("ARPlaneEvent", message: ["key": "planeAnchorChanged", "data": ["id": id, "action": "update", "anchor": anchors[id]]])
        fixOrphans()
    }
    func removePlaneAnchor(_ anchor:ARPlaneAnchor, withNode: SCNNode) {
        let id = anchor.identifier.uuidString
        anchors.removeValue(forKey: id)
        baseNodes.removeValue(forKey: id)
        doSendEvent("ARPlaneEvent", message: ["key": "planeAnchorRemoved", "data": ["id": id]])
    }
    var doDetectPlanes:String = ""
    @objc func setPlaneDetection(_ detectPlanes: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        doDetectPlanes = detectPlanes
        setPlaneDetection()
        resolve(true)
    }
    func setPlaneDetection() {
        let i = PlaneDetection[doDetectPlanes] ?? 0
        configuration.planeDetection = ARWorldTrackingConfiguration.PlaneDetection(rawValue: i)
        doResume()
    }
    @objc func getAnchors(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(anchors)
    }
    func addImageAnchor(_ anchor: ARImageAnchor, withNode: SCNNode) {
        guard let name = anchor.referenceImage.name else { return }
        let id = anchor.identifier.uuidString
        let w = anchor.referenceImage.physicalSize.width
        let h = anchor.referenceImage.physicalSize.height
        anchors[name] = ["type": "image", "name": name, "plane": ["width": w, "height":h]]
        baseNodes[name] = withNode
        doSendEvent("ARImageEvent", message: ["key": "imageAnchorAdded", "data":["id":id, "action": "add", "anchor": anchors[name]!]])
    }
    
    func updateImageAnchor(_ anchor: ARImageAnchor, withNode: SCNNode) {
        let id = anchor.identifier.uuidString
        guard let name = anchors[id]?["name"] as? String else { return }
        let w = anchor.referenceImage.physicalSize.width
        let h = anchor.referenceImage.physicalSize.height
        anchors[name] = ["type": "image", "name": name, "plane": ["width": w, "height":h]]
        doSendEvent("ARImageEvent", message: ["key": "imageAnchorChanged", "data":["id":id, "action": "update", "anchor": anchors[name]!]])
    }
    func removeImageAnchor(_ anchor: ARImageAnchor, withNode: SCNNode) {
        let id = anchor.identifier.uuidString
        guard let name = anchors[id]?["name"] as? String else { return }
        anchors.removeValue(forKey: name)
        baseNodes.removeValue(forKey: name)
        doSendEvent("ARImageEvent", message: ["key": "imageAnchorRemoved", "data": ["id": id]])

    }
    @objc func removeAnchor(_ id:String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let s = session else {return}
        guard let a = anchorObjects[id] else { return }
        s.remove(anchor: a)
        anchorObjects.removeValue(forKey: id)
        anchors.removeValue(forKey: id)
        baseNodes.removeValue(forKey: id)
        resolve(true)
    }
    //MARK: Image Recognizer methods
    @objc func addRecognizerImage(_ url:String, name: String, width: Double, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let fullURL = URL(string: url) else { reject("bad_url", "Could not resolve url " + url, nil); return}
        let path = fullURL.path
        guard let i = UIImage(contentsOfFile: path) else { reject("no_image", "could not get image from " + url, nil); return }
        guard let ci = CIImage(image: i) else { reject("no_ciimage", "Could not create Core Image value from " + url, nil); return}
        let context = CIContext(options: nil)
        guard let cg = context.createCGImage(ci, from: ci.extent) else { reject("no_cgimage", "Could not create CG Iamge from " + url, nil); return }
        let x = ARReferenceImage(cg, orientation: CGImagePropertyOrientation.up, physicalWidth: CGFloat(width))
        x.name = name
        detectionImages[name] = x
        setDetectionImages()
        resolve(name)
    }
    @objc func removeRecognizerImage(_ name: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        detectionImages.removeValue(forKey: name)
        setDetectionImages()
        resolve(true)
    }
    var detectionImages:[String: ARReferenceImage] = [:]
    var doDetectImages: Bool = false
    func setDetectionImages() {
        if(doDetectImages) {
            if(detectionImages.count > 0) {
                configuration.detectionImages = Set(detectionImages.values.map{$0})
            }
        } else {
            configuration.detectionImages = nil
        }
        doResume()
    }
    @objc func setImageDetection(_ doDetect:Bool, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        doDetectImages = doDetect
        setDetectionImages()
        resolve(true)
    }
    //MARK: Point of View methods
    var lastPosition:SCNVector3 = SCNVector3()
    var lastOrientation:SCNVector4 = SCNVector4()
    var sensitivity:Float = 0.005
    var orientationSensitivity: Float = 0.0005
    @objc func projectNode(_ nodeID: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let n = nodes[nodeID] else { reject("no_node", "No node named " + nodeID, nil); return }
        let v = n.worldPosition
        projectWorldPoint(v, resolve: resolve, reject: reject)
    }
    @objc func projectWorldPoint(_ v: SCNVector3, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let av = pv else { reject("no_renderer", "No renderer for the scene", nil); return }
        let p = av.projectPoint(v)
        resolve(vector3ToJson(p))
    }
    
    func updatePOV(_ pointOfView: SCNNode) {
        
        if
            abs(lastPosition.x - pointOfView.position.x) > sensitivity ||
            abs(lastPosition.y - pointOfView.position.y) > sensitivity ||
            abs(lastPosition.z - pointOfView.position.z) > sensitivity ||
            abs(lastOrientation.x - pointOfView.orientation.x) > orientationSensitivity ||
            abs(lastOrientation.y - pointOfView.orientation.y) > orientationSensitivity ||
            abs(lastOrientation.z - pointOfView.orientation.z) > orientationSensitivity ||
            abs(lastOrientation.w - pointOfView.orientation.w) > orientationSensitivity
        {
            doSendEvent("ARPositionChange", message: ["key": "positionChanged", "data": ["position": vector3ToJson(pointOfView.position), "orientation": vector4ToJson(pointOfView.orientation)]])
            lastPosition = pointOfView.position
            lastOrientation = pointOfView.orientation
        }
    }
    @objc func setPOVSensitivity(_ newSensitivity:Double , resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        sensitivity = Float(newSensitivity)
        resolve(true)
    }
    @objc func setPOVOrientationSensitivity(_ newSensitivity: Double, resolve: RCTPromiseResolveBlock, recject: RCTPromiseRejectBlock) {
        orientationSensitivity = Float(newSensitivity)
        resolve(true)
    }
    @objc func getPOV(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(lastPosition)
    }
    //MARK: World Tracking methods
    @objc func setWorldTracking(_ trackingMode: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        var temp:ARWorldTrackingConfiguration.WorldAlignment
        switch(trackingMode) {
        case "camera":
            temp = .camera
        case "compass":
            temp = .gravityAndHeading
        default:
            temp = .gravity
        }
        if(temp != configuration.worldAlignment) {
            configuration.worldAlignment = temp
            doResume()
        }
    }
    @objc func hitTestPlane(_ point: CGPoint, detectType: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let detectTypes : ARHitTestResult.ResultType
        
        switch(detectType) {
        case "featurePoint":
            detectTypes = ARHitTestResult.ResultType.featurePoint
        case "existingPlane":
            detectTypes = ARHitTestResult.ResultType.existingPlane
        case "existingPlaneUsingExtent":
            detectTypes = ARHitTestResult.ResultType.existingPlaneUsingExtent
        case "existingPlaneUsingGeometry":
            detectTypes = ARHitTestResult.ResultType.existingPlaneUsingGeometry
        case "estimatedHorizontalPlane":
            detectTypes = ARHitTestResult.ResultType.estimatedHorizontalPlane
        case "estimatedVerticalPlane":
            detectTypes = ARHitTestResult.ResultType.estimatedVerticalPlane
        default:
            detectTypes = ARHitTestResult.ResultType.featurePoint
        }
        
        guard let av = pv else { reject("no_renderer", "No renderer for the scene", nil); return }
        let hitTestResults = av.hitTest(point, types: detectTypes)
        
        if let result = hitTestResults.first {
            var type : NSString
            let anchor : ARAnchor? = result.anchor
            let anchorUuid = anchor != nil ? anchor?.identifier.uuidString : ""
            let distance = result.distance
            
            let worldTransformPositionVector = result.worldTransform.columns.3
            let localTransformPositionVector = result.localTransform.columns.3
            
            let positionAbsolute = SCNVector3Make(worldTransformPositionVector.x, worldTransformPositionVector.y, worldTransformPositionVector.z)
            let position = SCNVector3Make(localTransformPositionVector.x, localTransformPositionVector.y, localTransformPositionVector.z)
            
            switch(result.type) {
            case ARHitTestResult.ResultType.featurePoint:
                type = "featurePoint"
            case ARHitTestResult.ResultType.existingPlane:
                type = "existingPlane"
            case ARHitTestResult.ResultType.existingPlaneUsingExtent:
                type = "existingPlaneUsingExtent"
            case ARHitTestResult.ResultType.existingPlaneUsingGeometry:
                type = "existingPlaneUsingGeometry"
            case ARHitTestResult.ResultType.estimatedHorizontalPlane:
                type = "estimateHorizontalPlane"
            case ARHitTestResult.ResultType.estimatedVerticalPlane:
                type = "estimateVerticalPlane"
            default:
                type = "featurePoint"
            }
            
            resolve(["anchor": anchorUuid, "type": type, "distance": distance, "positionAbsolute": vector3ToJson(positionAbsolute), "position": vector3ToJson(position)])
        }
        else {
            resolve(false)
        }
        
    }
    //MARK: ARProjectedView Management
    var nodeViewRegistry: [String: [UIView]] = [:]
    func registerView(_ forNode: String?, view: UIView) {
        guard let n =  forNode else { removePView(view); return }
        
        var rs = nodeViewRegistry[n] ?? []
        guard !rs.contains(view) else { return }//Our work here is done
        removePView(view) // Remove from all other views
        rs.append(view)
        nodeViewRegistry[n] = rs
    }
    func removePView(_ view: UIView) {
        nodeViewRegistry.forEach() {k, vs in
            if vs.contains(view) {
                nodeViewRegistry[k] = vs.filter(){ v in
                    return v != view
                }
            }
        }
    }
    func updateRegisteredViews() {
        nodeViewRegistry.forEach() { n, vs in
            guard let node = nodes[n] else { return }
            let p = node.worldPosition
            let xy = self.pv!.projectPoint(p)
            if xy.z > 1 {
                DispatchQueue.main.async() {
                    vs.forEach() { v in
                        v.frame.origin = CGPoint(x: 10000, y: 10000)
                    }
                }
            } else {
                DispatchQueue.main.async() {

                vs.forEach() { v in
                        v.frame.origin = CGPoint(x: CGFloat(xy.x), y: CGFloat(xy.y))
                    }
                }
            }
        }
    }
}
