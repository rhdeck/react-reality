#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
@interface RCT_EXTERN_MODULE(RHDARDeviceMotion, RCTEventEmitter)
RCT_EXTERN_METHOD(setUpdateInterval:(NSNumber *)interval);
RCT_EXTERN_METHOD(getUpdateInterval:(RCTResponseSenderBlock)cb);
RCT_EXTERN_METHOD(getData:(RCTResponseSenderBlock)cb);
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
RCT_EXPORT_VIEW_PROPERTY(onPlaneDetected, RCTBubblingEventBlock?);
RCT_EXPORT_VIEW_PROPERTY(onPlaneRemoved, RCTBubblingEventBlock?);
RCT_EXPORT_VIEW_PROPERTY(onFeaturesDetected, RCTBubblingEventBlock?);
RCT_EXPORT_VIEW_PROPERTY(onLightEstimation, RCTBubblingEventBlock?);
RCT_EXPORT_VIEW_PROPERTY(onPlaneUpdate, RCTBubblingEventBlock?);
RCT_EXPORT_VIEW_PROPERTY(onTrackingState, RCTBubblingEventBlock?);
RCT_EXPORT_VIEW_PROPERTY(onTapOnPlaneUsingExtent, RCTBubblingEventBlock?);
RCT_EXPORT_VIEW_PROPERTY(onTapOnPlaneNoExtent, RCTBubblingEventBlock?);
RCT_EXPORT_VIEW_PROPERTY(onEvent, RCTBubblingEventBlock?);
RCT_EXPORT_VIEW_PROPERTY(onARKitError, RCTBubblingEventBlock?);
RCT_EXPORT_VIEW_PROPERTY(debug, Bool);
RCT_EXPORT_VIEW_PROPERTY(planeDetection, Bool);
RCT_EXPORT_VIEW_PROPERTY(origin, jsonType);
RCT_EXPORT_VIEW_PROPERTY(lightEstimationEnabled, Bool);
RCT_EXPORT_VIEW_PROPERTY(autoEnablesDefaultLighting, Bool);
RCT_EXPORT_VIEW_PROPERTY(worldAlignment, ARConfiguration.WorldAlignment);
@end