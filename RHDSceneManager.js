import { NativeModules, NativeEventEmitter } from "react-native";
import {
  doTap,
  addNode,
  removeNode,
  updateNode,
  setBox,
  setCapsule,
  setCone,
  setCylinder,
  setPlane,
  setPyramid,
  setSphere,
  setText,
  setTorus,
  setTube,
  setGeometry,
  setMaterial,
  setMaterialProperty,
  removeGeometry,
  removeMaterial,
  addSKSceneReference,
  addSKSceneByReference,
  addSKScene,
  setSKLabelNode,
  updateSKLabelNode,
  setSKNode,
  removeSKNode,
  removeSKScene,
  addSKLabelNode,
  addSKNode,
  clear,
  resume,
  pause,
  addRecognizerImage,
  removeRecognizerImage,
  setPlaneDetection,
  setImageDetection,
  setAnimationDuration,
  setAnimationType,
  setAnimation
} from "./RNSwiftBridge";
const { RHDSceneManager } = NativeModules;
//#region Event Management
var cachedEmitter = null;
var cachedListener = null;
var cachedHandlers = {};
const getEventListener = () => {
  if (!cachedEmitter) cachedEmitter = new NativeEventEmitter(RHDSceneManager);
  return cachedEmitter;
};
const addListener = (key, cb) => {
  if (!cachedListener)
    cachedListener = getEventListener().addListener("RHDAR", masterHandler);
  cachedHandlers[key] = cb;
};
const masterHandler = body => {
  const key = body.key;
  if (!key) {
    console.log("No key specified in event ", body);
    return;
  }
  const data = body.data;
  if (typeof cachedHandlers[key] == "function") cachedHandlers[key](data);
  else console.log("No handler for key", key);
};
const removeListener = key => {
  delete cachedHandlers[key];
};
const stopListening = () => {
  if (cachedListener) {
    cachedListener.remove();
  }
  cachedHandlers = {};
};
//#endregion
//#region Plane Detection
const addPlaneDetection = async cb => {
  await setPlaneDetection(true);
  addListener("planeDetected", cb);
};
const removePlaneDetection = async () => {
  await setPlaneDetection(false);
  removeListener("planeDetected");
};
//#endregion
//#region Image Detection
const addImageDetection = async cb => {
  addListener("imageDetected", cb);
  return await setImageDetection(true);
};
const removeImageDetection = async () => {
  removeListener("imageDetected");
  return await setImageDetection(false);
};

const removeAnimation = async () => {
  return await setAnimationDuration(0);
};
export {
  clear,
  resume,
  pause,
  addPlaneDetection,
  removePlaneDetection,
  doTap,
  setMaterial,
  setMaterialProperty,
  removeMaterial,
  addNode,
  removeNode,
  updateNode,
  addSKLabelNode,
  addSKNode,
  addSKScene,
  addSKSceneByReference,
  addSKSceneReference,
  setSKLabelNode,
  setSKNode,
  addImageDetection,
  removeImageDetection,
  addRecognizerImage,
  removeRecognizerImage,
  setAnimationType,
  removeAnimation,
  setAnimationDuration,
  setAnimation
};
