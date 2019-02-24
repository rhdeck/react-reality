import React, { Children, useContext, cloneElement } from "react";
import ARMaterial from "./ARMaterial";
import { ARGeometryContext } from "./ARGeometry";
const ARMaterials = ({ children, ...props }) => {
  const { numSides } = useContext(ARGeometryContext);
  return (
    children &&
    numSides &&
    Array(numSides).map((_, i) => (
      <ARMaterial
        {...props}
        index={i}
        key={i}
        children={Children.map(children, cloneElement)}
      />
    ))
  );
};
const { index, ...propTypes } = ARMaterial.propTypes;
ARMaterials.propTypes = propTypes;
export default ARMaterials;
