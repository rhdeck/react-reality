#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
@interface RCT_EXTERN_MODULE(RHDARDeviceMotion, RCTEventEmitter)
RCT_EXTERN_METHOD(setUpdateInterval:(NSNumber *)interval);
RCT_EXTERN_METHOD(getUpdateInterval:(RCTResponseSenderBlock)cb);
RCT_EXTERN_METHOD(getData:(RCTResponseSenderBlock)cb);
@end
@interface RCT_EXTERN_MODULE(RHDARGeosManager, NSObject)
RCT_EXTERN_METHOD(addBox:(SCNBox *)geometry node:(SCNNode *)node frame:(NSString *)frame);
RCT_EXTERN_METHOD(addSphere:(SCNSphere *)geometry node:(SCNNode *)node frame:(NSString *)frame);
RCT_EXTERN_METHOD(addCylinder:(SCNCylinder *)geometry node:(SCNNode *)node frame:(NSString *)frame);
RCT_EXTERN_METHOD(addCone:(SCNCone *)geometry node:(SCNNode *)node frame:(NSString *)frame);
RCT_EXTERN_METHOD(addPyramid:(SCNPyramid *)geometry node:(SCNNode *)node frame:(NSString *)frame);
RCT_EXTERN_METHOD(addTube:(SCNTube *)geometry node:(SCNNode *)node frame:(NSString *)frame);
RCT_EXTERN_METHOD(addTorus:(SCNTorus *)geometry node:(SCNNode *)node frame:(NSString *)frame);
RCT_EXTERN_METHOD(addCapsule:(SCNCapsule *)geometry node:(SCNNode *)node frame:(NSString *)frame);
RCT_EXTERN_METHOD(addPlane:(SCNPlane *)geometry node:(SCNNode *)node frame:(NSString *)frame);
RCT_EXTERN_METHOD(addShape:(SCNShape *)geometry node:(SCNNode *)node frame:(NSString *)frame);
RCT_EXTERN_METHOD(addLight:(SCNLight *)light node:(SCNNode *)node frame:(NSString *)frame);
RCT_EXTERN_METHOD(unmount:(NSString *)identifier);
RCT_EXTERN_METHOD(updateNode:(NSString *)identifier properties:(NSDictionary *)properties);
@end
@interface RCT_EXTERN_MODULE(RHDARTextManager, NSObject)
RCT_EXTERN_METHOD(mount:(SCNTextNode *)textNode node:(SCNNode *)node frame:(NSString *)frame);
@end
@interface RCT_EXTERN_MODULE(RHDARViewManager, RCTViewManager)
RCT_EXTERN_METHOD(pause:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(resume:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(hitTestPlanes:(NSDictionary *)pointDict types:(NSNumber *)types resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(hitTestSceneObjects:(NSDictionary *)pointDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(getCamera:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(getCameraPosition:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(focusScene:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(clearScene:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(projectPoint:(NSDictionary *)pointDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXPORT_VIEW_PROPERTY(onPlaneDetected, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPlaneRemoved, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onFeaturesDetected, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onLightEstimation, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPlaneUpdate, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onTrackingState, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onTapOnPlaneUsingExtent, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onTapOnPlaneNoExtent, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onEvent, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onARKitError, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(debug, BOOL);
RCT_EXPORT_VIEW_PROPERTY(planeDetection, BOOL);
RCT_EXPORT_VIEW_PROPERTY(origin, NSDictionary *);
RCT_EXPORT_VIEW_PROPERTY(lightEstimationEnabled, BOOL);
RCT_EXPORT_VIEW_PROPERTY(autoEnablesDefaultLighting, BOOL);
RCT_EXPORT_VIEW_PROPERTY(worldAlignment, ARConfiguration.WorldAlignment *);
@end