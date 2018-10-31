#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
@interface RCT_EXTERN_MODULE(ARMonoViewManager, RCTViewManager)
RCT_EXTERN_METHOD(doTap:(double)x y:(double)y resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXPORT_VIEW_PROPERTY(preview, BOOL);
RCT_EXPORT_VIEW_PROPERTY(debugMode, BOOL);
@end
@interface RCT_EXTERN_MODULE(ARPrimaryViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(interPupilaryDistance, float);
RCT_EXPORT_VIEW_PROPERTY(holoOffsetY, float);
RCT_EXPORT_VIEW_PROPERTY(holoOffsetZ, float);
RCT_EXPORT_VIEW_PROPERTY(holoOffsetX, float);
RCT_EXPORT_VIEW_PROPERTY(fieldOfView, float);
@end
@interface RCT_EXTERN_MODULE(ARProjectedViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(parentNode, NSString *);
@end
@interface RCT_EXTERN_MODULE(ARSceneManager, RCTEventEmitter)
RCT_EXTERN_METHOD(addNode:(SCNNode *)node parentID:(NSString *)parentID resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(removeNode:(NSString *)id resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(updateNode:(NSString *)forNode newProps:(NSDictionary *)newProps resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setBox:(SCNBox *)g forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setCapsule:(SCNCapsule *)g forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setCone:(SCNCone *)g forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setCylinder:(SCNCylinder *)g forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setPlane:(SCNPlane *)g forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setPyramid:(SCNPyramid *)g forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setSphere:(SCNSphere *)g forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setText:(SCNText *)g forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setTorus:(SCNTorus *)g forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setTube:(SCNTube *)g forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setShape:(SCNShape *)g forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setGeometry:(SCNGeometry *)geometry forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setLight:(SCNLight *)light forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(removeLight:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setMaterial:(SCNMaterial *)material forNode:(NSString *)forNode atPosition:(NSInteger)atPosition resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setMaterialProperty:(NSDictionary *)json propertyName:(NSString *)propertyName forMaterialAtPosition:(NSInteger)forMaterialAtPosition forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(removeGeometry:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(removeMaterial:(NSString *)forNode atPosition:(NSInteger)atPosition resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setScene:(NSString *)forNode sourcePath:(NSString *)sourcePath resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setModel:(NSString *)forNode sourcePath:(NSString *)sourcePath resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(addSKSceneReference:(SKScene *)scene resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(addSKSceneByReference:(NSString *)sceneName forNode:(NSString *)forNode atPosition:(NSInteger)atPosition withType:(NSString *)withType resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(addSKScene:(SKScene *)scene forNode:(NSString *)forNode atPosition:(NSInteger)atPosition withType:(NSString *)withType resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(updateSKScene:(NSDictionary *)scene forNode:(NSString *)forNode atPosition:(NSInteger)atPosition withType:(NSString *)withType resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setSKLabelNode:(SKLabelNode *)node toParent:(NSString *)toParent resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(updateSKLabelNode:(NSDictionary *)json resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setSKVideoNode:(SKVideoNode *)node toParent:(NSString *)toParent resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(updateSKVideoNode:(NSDictionary *)json resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setSKNode:(SKNode *)node toParent:(NSString *)toParent resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(removeSKNode:(NSString *)name resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(removeSKScene:(NSString *)forNode atPosition:(NSInteger)atPosition withType:(NSString *)withType resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(addSKLabelNode:(SKLabelNode *)node toParent:(NSString *)toParent resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(addSKNode:(SKNode *)node toParent:(NSString *)toParent resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(clear:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(resume:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(pause:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setAnimation:(double)seconds type:(NSString *)type resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setAnimationDuration:(double)seconds resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setAnimationType:(NSString *)type resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setPlaneDetection:(NSString *)detectPlanes resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(getAnchors:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(removeAnchor:(NSString *)id resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(addRecognizerImage:(NSString *)url name:(NSString *)name width:(double)width resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(removeRecognizerImage:(NSString *)name resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setImageDetection:(BOOL)doDetect resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(projectNode:(NSString *)nodeID resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(projectWorldPoint:(SCNVector3 *)v resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setPOVSensitivity:(double)newSensitivity resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setPOVOrientationSensitivity:(double)newSensitivity resolve:(RCTPromiseResolveBlock)resolve recject:(RCTPromiseRejectBlock)recject);
RCT_EXTERN_METHOD(getPOV:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setWorldTracking:(NSString *)trackingMode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(hitTestPlane:(CGPoint *)point detectType:(NSString *)detectType resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
@end
@interface RCT_EXTERN_MODULE(ARSecondaryViewManager, RCTViewManager)
@end