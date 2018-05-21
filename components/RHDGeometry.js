import React, { Component, Children } from "react";
import PropTypes from "prop-types";
import filter from "lodash/filter";
import pickBy from "lodash/pickBy";
import * as RHDSceneManager from "../RHDSceneManager"; //@TODO Make this line unnecessary
export default (type, geomProps, numSides) => {
  const Geom = class extends Component {
    async nativeUpdate() {
      if (!this.props.parentNode)
        throw new Error("Cannot mount a Geometry without a parent Node");
      const mountFunc =
        typeof type == "function" ? type : RHDSceneManager["set" + type]; //@TODO Make this trinary unnecessary
      const filteredProps = pickBy(this.props, (v, k) => {
        return geomPropKeys.indexOf(k) > -1;
      });

      try {
        await mountFunc(
          {
            ...filteredProps
          },
          this.props.parentNode
        );
      } catch (e) {}
    }
    shouldComponentUpdate(nextProps) {
      return true;
    }
    async componentWillUnmount() {
      if (!this.props.parentNode)
        throw new Error("Cannot mount a Geometry without a parent Node");
      try {
        await RHDSceneManager.removeGeometry(this.props.parentNode);
      } catch (e) {}
    }
    render() {
      this.nativeUpdate();
      if (!this.props.children) return null;
      const c = Children.map(this.props.children, child => {
        return React.cloneElement(child, {
          parentNode: this.props.parentNode,
          numSides
        });
      });
      return c;
    }
  };
  Geom.propTypes = {
    ...geomProps,
    parentNode: PropTypes.string
  };
  const geomPropKeys = Object.keys(Geom.propTypes);
  return Geom;
};
