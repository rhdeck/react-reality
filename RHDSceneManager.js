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
  setAnimation,
  getAnchors
} from "./RNSwiftBridge";
const NativeObj = NativeModules.RHDSceneManager;
//const { RHDSceneManager } = NativeModules;
//#region Event Management
var cachedEmitter = null;
var cachedListener = null;
var cachedHandlers = {};
const getEmitter = () => {
  if (!cachedEmitter) {
    cachedEmitter = new NativeEventEmitter(NativeObj);
  }
  return cachedEmitter;
};
const addListener = (key, cb) => {
  if (!cachedListener) {
    cachedListener = getEmitter().addListener("RHDAREvent", masterHandler);
  }
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
  console.log("Killing my listener");
  if (cachedListener) {
    cachedListener.remove();
  }
  cachedHandlers = {};
};
//#endregion
//#region Plane Detection
var cachedPlaneListener;
var cachedPlaneHandler;
const addPlaneDetection = async cb => {
  cachedPlaneHandler = cb;
  if (!cachedPlaneListener) {
    cachedPlaneListener = getEmitter().addListener(
      "RHDPlaneEvent",
      cachedPlaneHandler
    );
  }
  await setPlaneDetection(true);
};
const removePlaneDetection = async () => {
  await setPlaneDetection(false);
  if (cachedPlaneListener) cachedPlaneListener.remove();
  cachedPlaneHandler = null;
  cachedPlaneListener = null;
};
//#endregion
//#region Image Detection
var cachedImageListener;
var cachedImageHandler;
const addImageDetection = async cb => {
  cachedImageHandler = cb;
  if (!cachedImageListener) {
    cachedImageListener = getEmitter().addListener(
      "RHDImageEvent",
      cachedImageHandler
    );
  }
  return await setImageDetection(true);
};
const removeImageDetection = async () => {
  if (cachedImageListener) cachedImageListener.remove();
  cachedImageHandler = null;
  cachedImageListener = null;
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
  setAnimation,
  getAnchors
};
