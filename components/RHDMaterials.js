import React, { Component, Children } from "react";
import PropTypes from "prop-types";
import {
  blendMode,
  lightingModel,
  shaders,
  colorBufferWriteMask,
  fillMode
} from "./lib/propTypes";
import pickBy from "lodash/pickBy";
import RHDMaterial from "./RHDMaterial";
class RHDMaterials extends Component {
  render() {
    var out = [];
    if (this.props.numSides) {
      for (var side = 0; side < this.props.numSides; side++) {
        var c = null;
        if (this.props.children)
          c = Children.map(this.props.children, child => {
            return React.cloneElement(child);
          });
        var key = this.props.parentNode + "-" + side.toString();
        const m = (
          <RHDMaterial {...this.props} index={side} children={c} key={key} />
        );
        out.push(m);
      }
    }
    return out;
  }
}
RHDMaterials.propTypes = pickBy(
  RHDMaterial.propTypes,
  (v, k) => ["index"].indexOf(k) === -1
);
export default RHDMaterials;
