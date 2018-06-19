import Foundation
import SceneKit
import SpriteKit
typealias jsonType = [String:Any]
@objc extension RCTConvert {
    @objc class func SCNMaterial(_ json:jsonType) -> SCNMaterial {
        let m:SCNMaterial = SceneKit.SCNMaterial()
        setMaterialProperties(m, properties: json)
        return m
    }
    @objc class func SCNVector3(_ json:jsonType) -> SCNVector3 {
        let x = json["x"] as? Double ?? 0
        let y = json["y"] as? Double ?? 0
        let z = json["z"] as? Double ?? 0
        return SceneKit.SCNVector3(x, y, z)
    }
    
    @objc class func SCNVector4(_ json: jsonType) -> SCNVector4 {
        let x = json["x"] as? Double ?? 0
        let y = json["y"] as? Double ?? 0
        let z = json["z"] as? Double ?? 0
        let w = json["w"] as? Double ?? 0
        return SceneKit.SCNVector4(x, y, z, w)
    }
    @objc class func SCNNode(_ json: jsonType) -> SCNNode {
        let n = SceneKit.SCNNode()
        if let name = json["id"] as? String {
            n.name = name
        }
        setNodeProperties(n, properties: json)
        return n
    }
    @objc class func SCNBox(_ json:jsonType)-> SCNBox {
        guard
            let w = json["width"] as? CGFloat,
            let h = json["height"] as? CGFloat,
            let l = json["length"] as? CGFloat
        else { return SceneKit.SCNBox() }
        let chamfer = json["chamfer"] as? CGFloat ?? 0
        let g = SceneKit.SCNBox(width: w, height: h, length: l, chamferRadius: chamfer)
        return g
    }
    @objc class func SCNCapsule(_ json: jsonType) -> SCNCapsule {
        guard
            let tr = json["capR"] as? CGFloat,
            let h = json["height"] as? CGFloat
            else { return SceneKit.SCNCapsule() }
        let g = SceneKit.SCNCapsule(capRadius: tr, height: h)
        return g
    }
    @objc class func SCNCone(_ json:jsonType)-> SCNCone {
        guard
            let tr = json["topR"] as? CGFloat,
            let br = json["bottomR"] as? CGFloat,
            let h = json["height"] as? CGFloat
            else { return SceneKit.SCNCone() }
        let g = SceneKit.SCNCone(topRadius: tr, bottomRadius: br, height: h)
        return g
    }
    @objc class func SCNCylinder(_ json:jsonType)-> SCNCylinder {
        guard
            let r = json["radius"] as? CGFloat,
            let h = json["height"] as? CGFloat
            else { return SceneKit.SCNCylinder() }
        let g = SceneKit.SCNCylinder(radius: r, height: h)
        return g
    }
    @objc class func SCNPlane(_ json: jsonType) -> SCNPlane {
        guard
            let w = json["width"] as? CGFloat,
            let h = json["height"] as? CGFloat
            else { return SceneKit.SCNPlane() }
        let g = SceneKit.SCNPlane(width: w, height: h)
        if let cr = json["cornerRadius"] as? CGFloat { g.cornerRadius = cr }
        if let i = json["cornerSegmentCount"] as? Int { g.cornerSegmentCount = i }
        if let i = json["widthSegmentCount"] as? Int { g.widthSegmentCount = i }
        if let i = json["heightSegmentCount"] as? Int { g.heightSegmentCount = i }
        return g
    }
    @objc class func SCNPyramid(_ json: jsonType) -> SCNPyramid {
        guard
            let w = json["width"] as? CGFloat,
            let h = json["height"] as? CGFloat,
            let l = json["length"] as? CGFloat
        else { return SceneKit.SCNPyramid() }
        let g = SceneKit.SCNPyramid(width: w, height: h, length: l)
        return g
    }
    @objc class func SCNSphere(_ json:jsonType)-> SCNSphere {
        guard
            let r = json["radius"] as? CGFloat
            else { return SceneKit.SCNSphere() }
        let g = SceneKit.SCNSphere(radius: r)
        return g
    }
    @objc class func SCNTorus(_ json: jsonType) -> SCNTorus {
        guard
            let tr = json["ringR"] as? CGFloat,
            let br = json["pipeR"] as? CGFloat
            else { return SceneKit.SCNTorus() }
        let g = SceneKit.SCNTorus(ringRadius: tr, pipeRadius: br)
        return g
    }
    @objc class func SCNTube(_ json: jsonType) -> SCNTube {
        guard
            let tr = json["innerR"] as? CGFloat,
            let br = json["outerR"] as? CGFloat,
            let h = json["height"] as? CGFloat
        else { return SceneKit.SCNTube() }
        let g = SceneKit.SCNTube(innerRadius: tr, outerRadius: br, height: h)
        return g
    }
    @objc class func SCNText(_ json: jsonType) -> SCNText {
        let baseFontSize:CGFloat = 12.0;
        let text = json["text"] as? String ?? "(null)"
        let depth = json["depth"] as? CGFloat ?? 0.0
        let fontSize = json["size"] as? CGFloat ?? baseFontSize
        let size:CGFloat = fontSize / baseFontSize;
        let st = SceneKit.SCNText(string: text, extrusionDepth: (depth / size))
        st.flatness = 0.1
        var f = UIFont.systemFont(ofSize: baseFontSize)
        if let fontName = json["fontName"] as? String {
            if let tf = UIFont(name: fontName, size: baseFontSize) { f = tf }
        }
        if let cf = json["chamfer"] as? CGFloat { st.chamferRadius = cf / size }
        st.font = f
        return st
    }
    @objc class func SCNLight(_ json: jsonType) -> SCNLight {
        let l = SceneKit.SCNLight()
        setLightProperties(l, properties: json)
        return l
    }
    @objc class func SCNShape(_ json: jsonType) -> SCNShape {
        guard
            let svg = json["pathSvg"] as? String
        else { return SceneKit.SCNShape()}
        let extrusion = json["extrusion"] as? CGFloat ?? 0.0
        let path = svgStringToBezier(svg)
        if let f = json["pathFlatness"] as? CGFloat { path.flatness = f }
        let uib = UIBezierPath(cgPath: path.cgPath)
        let g = SceneKit.SCNShape(path: uib, extrusionDepth: extrusion)
        if let e = json["chamferMode"] as? SCNChamferMode { g.chamferMode = e }
        if let f = json["chamferRadius"] as? CGFloat { g.chamferRadius = f }
        if let csvg = json["chamferProfilePathSvg"] as? String {
            let cpath = svgStringToBezier(csvg)
            if let f = json["chamferProfilePathFlatness"] as? CGFloat { cpath.flatness = f }
            let bb:CGRect = cpath.bounds
            if bb.size.width > 0 && bb.size.height > 0 {
                let scalex = 1 / bb.size.width
                let scaley = 1 / bb.size.height
                let transform = CGAffineTransform(scaleX: scalex, y: scaley)
                cpath.apply(transform)
                let cgpath = cpath.cgPath
                let upath = UIBezierPath(cgPath: cgpath)
               // g.chamferProfile = upath //Disabled chamfer for now because it keeps crashing @TODO
            }
        }
        return g
    }
    @objc class func SKLabelNode(_ json: jsonType) -> SKLabelNode {
        let skln = SpriteKit.SKLabelNode()
        doUpdateSKLabelNode(skln, json: json);
        skln.yScale = -1
        return skln
    }
    @objc class func SKScene(_ json: jsonType) -> SKScene {
        let s = SpriteKit.SKScene()
        doUpdateSKScene(s, json: json)
        return s
    }
    @objc class func SKVideoNode(_ json: jsonType) -> SKVideoNode {
        var svn: SpriteKit.SKVideoNode?
        if let s = json["url"] as? String {
            if let u = URL(string: s) {
                svn = SpriteKit.SKVideoNode(url: u)
            }
        } else if let s = json["path"] as? String {
            let u = URL(fileURLWithPath: s)
            NSLog("Loading video from path " + s)
            svn = SpriteKit.SKVideoNode(url: u)
        }
        if svn == nil { svn = SpriteKit.SKVideoNode() ; return svn! }
        doUpdateSKVideoNode(svn!, json: json)
        return svn!
    }
}
func doUpdateSKVideoNode(_ node:SKVideoNode, json: jsonType) {
    doUpdateSKNode(node, json: json)
    let h = json["height"] as? Double ?? 100
    let w = json["width"] as? Double ?? 100
    NSLog("Updating SKVideo to height " + String(h) + " and width " + String(w))
    node.size = CGSize(width: CGFloat(w), height: CGFloat(h))
    if json["isPlaying"] as? Bool ?? false {
        NSLog("Starting video...")
        DispatchQueue.main.async() {
            node.play()
        }
    } else {
        DispatchQueue.main.async() {
            node.pause()
        }
    }
}
func doUpdateSKNode(_ node: SKNode, json: jsonType) {
    if let s = json["name"] as? String { node.name = s }
    if let j = json["position"] as? jsonType {
        let x = j["x"] as? Double ?? 0
        let y = j["y"] as? Double ?? 0
        node.position = CGPoint(x: x, y: y)
    }
}
func doUpdateSKScene(_ scene:SKScene, json:jsonType) {
    if let s = json["name"] as? String { scene.name = s }
    if let i = json["color"] { scene.backgroundColor = RCTConvert.uiColor(i) }
    let h = json["height"] as? Double ?? 100
    let w = json["width"] as? Double ?? 100
    NSLog("Updating scene to height of " + String(h) + " and width of " + String(w) )
    print(json)
    scene.size = CGSize(width: CGFloat(w), height: CGFloat(h))
}
func doUpdateSKLabelNode(_ skln:SKLabelNode, json: jsonType) {
    doUpdateSKNode(skln, json: json)
    if let s = json["text"] as? String { skln.text = s }
    skln.numberOfLines = json["lines"] as? Int ?? 1
    switch json["lineBreak"] as? String {
        case "char": skln.lineBreakMode = .byCharWrapping
        case "ellipsis": skln.lineBreakMode = .byTruncatingTail
        case "word": skln.lineBreakMode = .byWordWrapping
        case nil: skln.lineBreakMode = skln.numberOfLines == 1 ? .byTruncatingTail : .byWordWrapping
        default:skln.lineBreakMode = skln.numberOfLines == 1 ? .byTruncatingTail : .byWordWrapping
    }
    skln.lineBreakMode = .byWordWrapping
    if let s = json["fontName"] as? String { skln.fontName = s }
    if let d = json["fontSize"] as? Double { skln.fontSize = CGFloat(d) }
    if let c = json["fontColor"] { skln.fontColor = RCTConvert.uiColor(c) }
    skln.verticalAlignmentMode = .top
    if let s = json["verticalAlignment"] as? String {
        switch s {
        case "top":
            skln.verticalAlignmentMode = .top
        case "baseline":
            skln.verticalAlignmentMode = .baseline
        case "bottom":
            skln.verticalAlignmentMode = .bottom
        case "center":
            skln.verticalAlignmentMode = .center
        default:
            print("Invalid verticalalignmentmode passed: " + s)
        }
    }
    skln.horizontalAlignmentMode = .left
    if let s = json["horizontalAlignment"] as? String {
        switch s {
        case "left":
            skln.horizontalAlignmentMode = .left
        case "center":
            skln.horizontalAlignmentMode = .center
        case "right":
            skln.horizontalAlignmentMode = .right
        default:
            print("Invalid horizontalalignmentmode passed " + s)
        }
    }
    if let d = json["width"] as? Double { skln.preferredMaxLayoutWidth = CGFloat(d) }
    if json["allowScaling"] as? Bool ?? true {
        let scalingFactor = skln.preferredMaxLayoutWidth / skln.frame.width
        if(scalingFactor < 1) {
            skln.fontSize = skln.fontSize * scalingFactor
        }
    }
}
func addMaterials(_ g:SCNGeometry, json: jsonType, sides:Int) {
    guard let mj = json["material"] as? jsonType else { return }
    let m = RCTConvert.SCNMaterial(mj)
    var ms:[SceneKit.SCNMaterial] = [];
    for _ in 1...sides {
        ms.append(m)
    }
    g.materials = ms
}
func setMaterialProperties(_ material:SCNMaterial, properties: jsonType) {
    material.isDoubleSided = properties["doubleSided"] as? Bool ?? true
    if let i = properties["blendMode"] as? SCNBlendMode { material.blendMode = i }
    if let lm = properties["lightingModel"] as? SCNMaterial.LightingModel { material.lightingModel  = lm }
    if let f = properties["transparency"] as? CGFloat { material.transparency = f}
    if let f = properties["metalness"] as? Double { material.lightingModel = .physicallyBased; material.metalness.contents = f}
    if let f = properties["roughness"] as? Double {  material.lightingModel = .physicallyBased; material.roughness.contents = f}
    if let x = properties["shaders"] as? [SCNShaderModifierEntryPoint: String] { material.shaderModifiers = x}
    if let b = properties["writesToDepthBuffer"] as? Bool { material.writesToDepthBuffer = b }
    if let i = properties["colorBufferWriteMask"] as? SCNColorMask { material.colorBufferWriteMask = i}
    if let i = properties["fillMode"] as? SCNFillMode { material.fillMode = i}
    if let b = properties["litPerPixel"] as? Bool { material.isLitPerPixel = b}
    material.transparencyMode = .aOne
}
func setNodeProperties(_ node:SCNNode, properties: jsonType) {
    if let i = properties["categoryBitMask"] as? Int { node.categoryBitMask = i }
    if let i = properties["renderingOrder"] as? Int { node.renderingOrder = i }
    if let b = properties["castsShadow"] as? Bool { node.castsShadow = b }
    if let d = properties["position"] as? jsonType { node.position = RCTConvert.SCNVector3(d) }
    if let f = properties["scale"] as? Double { node.scale = SCNVector3(f, f, f) }
    if let d = properties["eulerAngles"] as? jsonType { node.eulerAngles = RCTConvert.SCNVector3(d) }
    if let d = properties["orientation"] as? jsonType { node.orientation = RCTConvert.SCNVector4(d) }
    if let d = properties["rotation"] as? jsonType { node.rotation = RCTConvert.SCNVector4(d) }
    if let f = properties["opacity"] as? CGFloat { node.opacity = f }
}
func setMaterialPropertyContents(_ properties: jsonType, materialProperty: SCNMaterialProperty) {
    if let path = properties["path"] { materialProperty.contents = path }
    else if let color = properties["color"] { materialProperty.contents = RCTConvert.uiColor(color) }
    if let intensity = properties["intensity"] as? CGFloat { materialProperty.intensity = intensity }
}
func setShapeProperties(_ g:SCNGeometry, properties: jsonType) {
    properties.forEach() {k, v in
        guard
            let vs = v as? String,
            !specialShapeProperties.contains(vs),
            let f = Float(vs)
        else { return }
        g.setValue(f, forKey: k)
    }
    guard let shapeGeometry = g as? SCNShape else { return }
    if let s = properties["pathSvg"] as? String {
        let path = svgStringToBezier(s)
        if let f = properties["pathFlatness"] as? CGFloat { path.flatness = f }
        shapeGeometry.path = path
    }
    if let d = properties["chamferProfilesPathSvg"] as? jsonType { setChamferProfilePathSvg(shapeGeometry, properties: d) }
}
func svgStringToBezier(_ path:String) -> SVGBezierPath {
    NSLog("Starting with path " + path)
    guard let paths:[SVGBezierPath] = SVGBezierPath.paths(fromSVGString: path) as? [SVGBezierPath] else { return SVGBezierPath() }
    NSLog("I am continuing with interpreted paths: " + String(paths.count))
    let fullPath = paths[0];
    NSLog("Fullpath")
    NSLog(fullPath.svgRepresentation)
    NSLog("that's all she wrote")
    if(paths.count > 1) {
        for x in 2...paths.count {
            let p = paths[x-1]
            fullPath.append(p)
        }
    }
    return fullPath
}
func setChamferProfilePathSvg(_ g:SCNShape, properties: jsonType) {
    guard let svg = properties["chamferProfilePathSvg"] as? String else { return }
    let path = svgStringToBezier(svg)
    let cgpath = path.cgPath
    let upath = UIBezierPath(cgPath: cgpath)
    if let f = properties["chamferProfilePathFlatness"] as? CGFloat { upath.flatness = f }
    let bb:CGRect = upath.bounds
    if bb.size.width > 0 && bb.size.height > 0 {
        let scalex = 1 / bb.size.width
        let scaley = 1 / bb.size.height
        let transform = CGAffineTransform(scaleX: scalex, y: scaley)
        upath.apply(transform)
        g.chamferProfile = upath
    }
}
func setLightProperties(_ light:SCNLight, properties: jsonType) {
    if let i = properties["lightCategoryBitMask"] as? Int { light.categoryBitMask = i }
    if let e = properties["type"] as? SCNLight.LightType { light.type = e }
    if let c = properties["color"], let rc = RCTConvert.cgColor(c) { light.color = rc }
    if let f = properties["temperature"] as? CGFloat { light.temperature = f }
    if let f = properties["intensity"] as? CGFloat { light.intensity = f }
    if let f = properties["attenuationStartDistance"] as? CGFloat { light.attenuationStartDistance = f}
    if let f = properties["attenuationEndDistance"] as? CGFloat { light.attenuationEndDistance = f}
    if let f = properties["spotInnerAngle"] as? CGFloat { light.spotInnerAngle = f}
    if let f = properties["spotOuterAngle"] as? CGFloat { light.spotOuterAngle = f}
    if let b = properties["castsShadow"] as? Bool { light.castsShadow = b }
    if let f = properties["shadowRadius"] as? CGFloat { light.shadowRadius = f }
    if let c = properties["shadowColor"], let rc = RCTConvert.cgColor(c) { light.shadowColor = rc }
    if let i = properties["shadowSampleCount"] as? Int { light.shadowSampleCount = i }
    if let f = properties["shadowBias"] as? CGFloat { light.shadowBias = f }
    if let e = properties["shadowMode"] as? SCNShadowMode { light.shadowMode = e }
    if let f = properties["orthographicScale"] as? CGFloat { light.orthographicScale = f }
    if let f = properties["zFar"] as? CGFloat { light.zFar = f }
    if let f = properties["zNear"] as? CGFloat { light.orthographicScale = f }
}
let specialShapeProperties:Set = [
    "pathSvg",
    "chamferProfilePathSvg"
]
func vector3ToJson(_ v:SCNVector3) -> jsonType {
    return ["x": v.x, "y": v.y, "z": v.z]
}
func vector_float3ToJson(_ v:vector_float3) -> jsonType {
    return ["x": v.x, "y": v.y, "z": v.z]
}
func vector4ToJson(_ v:SCNVector4) -> jsonType {
    return ["x": v.x, "y": v.y, "z": v.z, "w": v.w]
}
func vector_float4ToVector3(_ v:vector_float4) -> SCNVector3 {
    return SCNVector3(v.x, v.y, v.z)
}
