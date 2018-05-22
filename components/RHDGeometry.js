import React, { Component, Children } from "react";
import PropTypes from "prop-types";
import filter from "lodash/filter";
import pickBy from "lodash/pickBy";
import { removeGeometry } from "../RHDSceneManager";
export default (mountFunc, geomProps, numSides) => {
  const RHDGeometry = class extends Component {
    state = { isMounted: false };
    async nativeUpdate() {
      console.log("Starting nativeUpdte for", this.props.parentNode);
      if (!this.props.parentNode)
        throw new Error("Cannot mount a Geometry without a parent Node");
      const filteredProps = pickBy(this.props, (v, k) => {
        return geomPropKeys.indexOf(k) > -1;
      });

      try {
        console.log("Hi there this is ray running");
        await mountFunc(
          {
            ...filteredProps
          },
          this.props.parentNode
        );
        console.log("Hi there this is ray and I ran");
        this.setState({ isMounted: true });
      } catch (e) {
        console.log("I got an error", e);
      }
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
      if (!this.state.isMounted) return null;
      console.log("Adding geometry!!!");
      const c = Children.map(this.props.children, child => {
        return React.cloneElement(child, {
          parentNode: this.props.parentNode,
          numSides
        });
      });
      return c;
    }
  };
  RHDGeometry.propTypes = {
    ...geomProps,
    parentNode: PropTypes.string
  };
  const geomPropKeys = Object.keys(RHDGeometry.propTypes);
  return RHDGeometry;
};
