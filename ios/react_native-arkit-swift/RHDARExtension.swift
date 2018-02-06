import Foundation
import SceneKit
typealias jsonType = [String:Any]

@objc extension RCTConvert {
    @objc class func SCNMaterial(_ json:jsonType) -> SCNMaterial {
        let m:SCNMaterial = SceneKit.SCNMaterial()
        setMaterialProperties(m, properties: json)
        return m
    }
    @objc class func SCNVector3(_ json:jsonType) -> SCNVector3 {
        guard
            let x = json["x"] as? Float,
            let y = json["y"] as? Float,
            let z = json["z"] as? Float
        else {
            return SceneKit.SCNVector3()
        }
        return SceneKit.SCNVector3(x, y, z)
    }
    @objc class func SCNVector4(_ json: jsonType) -> SCNVector4 {
        guard
            let x = json["x"] as? Float,
            let y = json["y"] as? Float,
            let z = json["z"] as? Float,
            let w = json["w"] as? Float
        else { return SceneKit.SCNVector4() }
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
            let shape = json["shape"] as? jsonType,
            let w = shape["width"] as? CGFloat,
            let h = shape["height"] as? CGFloat,
            let l = shape["length"] as? CGFloat,
            let chamfer = shape["chamfer"] as? CGFloat
        else { return SceneKit.SCNBox() }
        let g = SceneKit.SCNBox(width: w, height: h, length: l, chamferRadius: chamfer)
        addMaterials(g, json:json, sides: 6)
        return g
    }
    @objc class func SCNSphere(_ json:jsonType)-> SCNSphere {
        guard
            let shape = json["shape"] as? jsonType,
            let r = shape["radius"] as? CGFloat
        else { return SceneKit.SCNSphere() }
        let g = SceneKit.SCNSphere(radius: r)
        addMaterials(g, json:json, sides: 1)
        return g
    }
    @objc class func SCNCylinder(_ json:jsonType)-> SCNCylinder {
        guard
            let shape = json["shape"] as? jsonType,
            let r = shape["radius"] as? CGFloat,
            let h = shape["height"] as? CGFloat
        else { return SceneKit.SCNCylinder() }
        let g = SceneKit.SCNCylinder(radius: r, height: h)
        addMaterials(g, json:json, sides: 3)
        return g
    }
    @objc class func SCNCone(_ json:jsonType)-> SCNCone {
        guard
            let shape = json["shape"] as? jsonType,
            let tr = shape["topR"] as? CGFloat,
            let br = shape["bottomR"] as? CGFloat,
            let h = shape["height"] as? CGFloat
            else { return SceneKit.SCNCone() }
        let g = SceneKit.SCNCone(topRadius: tr, bottomRadius: br, height: h)
        addMaterials(g, json:json, sides: 2) //RHD: Doesn't this have thre if tr > 0 ?
        return g
    }
    @objc class func SCNPyramid(_ json: jsonType) -> SCNPyramid {
        guard
            let shape = json["shape"] as? jsonType,
            let w = shape["width"] as? CGFloat,
            let h = shape["height"] as? CGFloat,
            let l = shape["length"] as? CGFloat
        else { return SceneKit.SCNPyramid() }
        let g = SceneKit.SCNPyramid(width: w, height: h, length: l)
        addMaterials(g, json:json, sides: 5)
        return g
    }
    @objc class func SCNTube(_ json: jsonType) -> SCNTube {
        guard
            let shape = json["shape"] as? jsonType,
            let tr = shape["innerR"] as? CGFloat,
            let br = shape["outerR"] as? CGFloat,
            let h = shape["height"] as? CGFloat
        else { return SceneKit.SCNTube() }
        let g = SceneKit.SCNTube(innerRadius: tr, outerRadius: br, height: h)
        addMaterials(g, json:json, sides: 1)
        return g
    }
    @objc class func SCNTorus(_ json: jsonType) -> SCNTorus {
        guard
            let shape = json["shape"] as? jsonType,
            let tr = shape["ringR"] as? CGFloat,
            let br = shape["pipeR"] as? CGFloat
            else { return SceneKit.SCNTorus() }
        let g = SceneKit.SCNTorus(ringRadius: tr, pipeRadius: br)
        addMaterials(g, json:json, sides: 1)
        return g
    }
    @objc class func SCNCapsule(_ json: jsonType) -> SCNCapsule {
        guard
            let shape = json["shape"] as? jsonType,
            let tr = shape["capR"] as? CGFloat,
            let h = shape["height"] as? CGFloat
            else { return SceneKit.SCNCapsule() }
        let g = SceneKit.SCNCapsule(capRadius: tr, height: h)
        addMaterials(g, json:json, sides: 1)
        return g
    }
    @objc class func SCNPlane(_ json: jsonType) -> SCNPlane {
        guard
            let shape = json["shape"] as? jsonType,
            let w = shape["width"] as? CGFloat,
            let h = shape["height"] as? CGFloat
        else { return SceneKit.SCNPlane() }
        let g = SceneKit.SCNPlane(width: w, height: h)
        if let cr = shape["cornerRadius"] as? CGFloat { g.cornerRadius = cr }
        if let i = shape["cornerSegmentCount"] as? Int { g.cornerSegmentCount = i }
        if let i = shape["widthSegmentCount"] as? Int { g.widthSegmentCount = i }
        if let i = shape["heightSegmentCount"] as? Int { g.heightSegmentCount = i }
        addMaterials(g, json:json, sides: 1)
        return g
    }
    @objc class func SCNTextNode(_ json: jsonType) -> SCNNode {
        let baseFontSize:CGFloat = 12.0;
        let font = json["font"] as? jsonType ?? [:]
        let text = json["text"] as? String ?? "(null)"
        let depth = font["depth"] as? CGFloat ?? 0.0
        var size:CGFloat = 1;
        let st = SCNText(string: text, extrusionDepth: depth / size)
        var f = UIFont.systemFont(ofSize: baseFontSize)
        if let s = font["size"] as? CGFloat { size = s }
        if let fontName = font["name"] as? String {
            if let tf = UIFont(name: fontName, size: baseFontSize) { f = tf }
        }
        if let cf = font["chamfer"] as? CGFloat { st.chamferRadius = cf / size }
        st.font = f
        addMaterials(st, json:json, sides: 5)
        let stn = SceneKit.SCNNode(geometry: st)
        if let n = json["id"] as? String { stn.name = n }
        stn.scale = SceneKit.SCNVector3(size, size, size)
        let bbmin = stn.boundingBox.min
        let bbmax = stn.boundingBox.max
        let sf = Float(size)
        stn.position = SceneKit.SCNVector3(-(bbmin.x+bbmax.x) / 2 * sf, -(bbmin.y + bbmax.y) / 2 * sf, -(bbmin.z + bbmax.z) / 2 * sf)
        return stn
    }
    @objc class func SCNLight(_ json: jsonType) -> SCNLight {
        let l = SceneKit.SCNLight()
        setLightProperties(l, properties: json)
        return l
    }
    @objc class func SCNShape(_ json: jsonType) -> SCNShape {
        guard
            let shape = json["shape"] as? jsonType,
            let svg = shape["pathSvg"] as? String,
            let extrusion = shape["extrusion"] as? CGFloat
        else { return SceneKit.SCNShape()}
        let path = svgStringToBezier(svg)
        if let f = shape["pathFlatness"] as? CGFloat { path.flatness = f }
        let g = SceneKit.SCNShape(path: path, extrusionDepth: extrusion)
        if let e = shape["chamferMode"] as? SCNChamferMode { g.chamferMode = e }
        if let f = shape["chamferRadius"] as? CGFloat { g.chamferRadius = f }
        if let s = shape["chamferProfilePathSvg"] as? String { setChamferProfilePathSvg(g, properties: shape) }
        addMaterials(g, json: json, sides:1)
        return g
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
    if let j = properties["diffuse"] as? jsonType { setMaterialPropertyContents(j, material: material.diffuse) }
    if let j = properties["normal"] as? jsonType { setMaterialPropertyContents(j, material: material.normal) }
    if let j = properties["displacement"] as? jsonType { setMaterialPropertyContents(j, material: material.displacement)}
    if let j = properties["specular"] as? jsonType { setMaterialPropertyContents(j, material: material.specular)}
    if let f = properties["transparency"] as? CGFloat { material.transparency = f}
    if let f = properties["metalness"] as? Float { material.lightingModel = .physicallyBased; material.metalness.contents = f}
    if let f = properties["roughness"] as? Float {  material.lightingModel = .physicallyBased; material.roughness.contents = f}
    if let x = properties["shaders"] as? [SCNShaderModifierEntryPoint: String] { material.shaderModifiers = x}
    if let b = properties["writesToDepthBuffer"] as? Bool { material.writesToDepthBuffer = b }
    if let i = properties["colorBufferWriteMask"] as? SCNColorMask { material.colorBufferWriteMask = i}
    if let i = properties["fillMode"] as? SCNFillMode { material.fillMode = i}
    if let b = properties["doubleSided"] as? Bool { material.isDoubleSided = b}
    if let b = properties["litPerPixel"] as? Bool { material.isLitPerPixel = b}
}
func setNodeProperties(_ node:SCNNode, properties: jsonType) {
    if let i = properties["categoryBitMask"] as? Int { node.categoryBitMask = i }
    if let i = properties["renderingOrder"] as? Int { node.renderingOrder = i }
    if let b = properties["castsShadow"] as? Bool { node.castsShadow = b }
    if let d = properties["transition"] as? jsonType, let f = d["duration"] as? Double { SCNTransaction.animationDuration = f }
    else { SCNTransaction.animationDuration = 0 }
    if let d = properties["position"] as? jsonType { node.position = RCTConvert.SCNVector3(d) }
    if let f = properties["scale"] as? Float { node.scale = SCNVector3(f, f, f) }
    if let d = properties["eulerAngles"] as? jsonType { node.eulerAngles = RCTConvert.SCNVector3(d) }
    if let d = properties["orientation"] as? jsonType { node.orientation = RCTConvert.SCNVector4(d) }
    if let d = properties["rotation"] as? jsonType { node.rotation = RCTConvert.SCNVector4(d) }
    if let f = properties["opacity"] as? CGFloat { node.opacity = f }
}
func setMaterialPropertyContents(_ properties: jsonType, material: SCNMaterialProperty) {
    if let path = properties["path"] { material.contents = path }
    else if let color = properties["color"] { material.contents = RCTConvert.uiColor(color) }
    if let intensity = properties["intensity"] as? CGFloat { material.intensity = intensity }
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
    if let d = properties["chamferProfilesPethSvg"] as? jsonType { setChamferProfilePathSvg(shapeGeometry, properties: d) }
}
func svgStringToBezier(_ path:String) -> SVGBezierPath {
    guard let paths:[SVGBezierPath] = SVGBezierPath.paths(fromSVGString: path) as? [SVGBezierPath] else { return SVGBezierPath() }
    let fullPath = paths[0];
    for x in 2...paths.count {
        let p = paths[x-1]
        fullPath.append(p)
    }
    return fullPath
}
func setChamferProfilePathSvg(_ g:SCNShape, properties: jsonType) {
    guard let svg = properties["camferProfilePathSvg"] as? String else { return }
    let path = svgStringToBezier(svg)
    if let f = properties["chamferProfilePathFlatness"] as? CGFloat { path.flatness = f }
    let bb:CGRect = path.bounds
    if bb.size.width > 0 && bb.size.height > 0 {
        let scalex = 1 / bb.size.width
        let scaley = 1 / bb.size.height
        let transform = CGAffineTransform(scaleX: scalex, y: scaley)
        path.apply(transform)
        g.chamferProfile = path
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
