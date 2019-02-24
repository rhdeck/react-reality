import { ARMonoView as NativeMonoView } from "./RNSwiftBridge";
import React, { useEffect, useContext } from "react";
import { ARSessionProvider } from "./ARSessionProvider";
const ARMonoView = ({
  preview = true,
  debugMode = false,
  start,
  stop,
  children
}) => {
  useEffect(() => {
    if (start) start();
    return () => stop && stop();
  }, []);
  const { isStarted } = useContext(ARSessionContext);
  if (typeof isStarted === "undefined")
    return (
      <ARSessionProvider>
        <ARMonoView {...{ preview, debugMode, start, stop, children }} />
      </ARSessionProvider>
    );
  else
    return [
      <NativeMonoView {...{ preview, debugMode }} key="ARMonoViewNative" />,
      children
    ];
};
export default ARMonoView;
