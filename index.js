import { NativeModules, NativeEventEmitter } from "react-native";
const react_native-arkit-swift_native = NativeModules.react_native-arkit-swift;

const react_native-arkit-swift = {
  nativeObj: react_native-arkit-swift_native,
  a: react_native-arkit-swift_native.a,
  b: react_native-arkit-swift_native.b,
  startTime: react_native-arkit-swift_native.startTime,
  addListener: cb => {
    const e = new NativeEventEmitter(react_native-arkit-swift_native);
    const s = e.addListener("react_native-arkit-swift", cb);
    return s;
  },
  addListenerDemo: () => {
    react_native-arkit-swift.addListener(arr => {
      console.log("Received a react-native-arkit-swift event", arr.message);
    });
  },
  emitMessage: (message, delayms) => {
    if (!delayms) delayms = 0;
    return react_native-arkit-swift_native.delayedSend(message, delayms);
  },
  demoWithVoid: obj => {
    //Note no point in returning since it is a void function - no promise!
    react_native-arkit-swift_native.demoVoid(obj);
  },
  demoWithPromise: message => {
    //Returns a promise!
    return react_native-arkit-swift_native.demo(message);
  }
};

export default react_native-arkit-swift;
