#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
@interface RCT_EXTERN_MODULE(RHDMonoViewManager, RCTViewManager)
RCT_EXTERN_METHOD(doTap:(double)x y:(double)y resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXPORT_VIEW_PROPERTY(preview, BOOL);
@end
@interface RCT_EXTERN_MODULE(RHDPrimaryViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(interPupilaryDistance, float);
@end
@interface RCT_EXTERN_MODULE(RHDSceneManager, RCTEventEmitter)
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
RCT_EXTERN_METHOD(setGeometry:(SCNGeometry *)geometry forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setMaterial:(SCNMaterial *)material forNode:(NSString *)forNode atPosition:(NSInteger)atPosition resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setMaterialProperty:(NSDictionary *)json propertyName:(NSString *)propertyName forMaterialAtPosition:(NSInteger)forMaterialAtPosition forNode:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(removeGeometry:(NSString *)forNode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(removeMaterial:(NSString *)forNode atPosition:(NSInteger)atPosition resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(addSKSceneReference:(SKScene *)scene resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(addSKSceneByReference:(NSString *)sceneName forNode:(NSString *)forNode atPosition:(NSInteger)atPosition withType:(NSString *)withType resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(addSKScene:(SKScene *)scene forNode:(NSString *)forNode atPosition:(NSInteger)atPosition withType:(NSString *)withType resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setSKLabelNode:(SKLabelNode *)node toParent:(NSString *)toParent resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(updateSKLabelNode:(NSDictionary *)json resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(setSKNode:(SKNode *)node toParent:(NSString *)toParent resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(removeSKNode:(NSString *)name resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(removeSKScene:(NSString *)forNode atPosition:(NSInteger)atPosition withType:(NSString *)withType resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(addSKLabelNode:(SKLabelNode *)node toParent:(NSString *)toParent resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(addSKNode:(SKNode *)node toParent:(NSString *)toParent resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(clear:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(resume:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(pause:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
@end
@interface RCT_EXTERN_MODULE(RHDSecondaryViewManager, RCTViewManager)
@end