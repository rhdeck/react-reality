import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import {
  addPlaneDetection,
  removePlaneDetection,
  getAnchors,
  addImageDetection,
  removeImageDetection,
  addRecognizerImage,
  removeRecognizerImage
} from "./RHDSceneManager";
const { Provider, Consumer: RHDTrackingConsumer } = createContext();
class RHDTrackingProvider extends Component {
  state = {
    planeDetection: false,
    imageDetection: false,
    transition: 0,
    anchors: {},
    providerValue: this.setProviderValue(true)
  };
  constructor(props) {
    super(props);
    this.state.providerValue = this.setProviderValue(true);
  }
  setProviderValue(skipState) {
    const providerValue = {
      anchors: this.state ? this.state.anchors : {}
    };
    if (!skipState)
      this.setState({ providerValue }, () => {
        if (this.props.didUpdateAnchors)
          this.props.didUpdateAnchors(this.state.providerValue.anchors);
      });
    return providerValue;
  }
  render() {
    console.log("rendering trackingwrapper");
    return (
      <Provider value={this.state.providerValue}>
        {typeof this.props.children == "function" ? (
          <RHDTrackingConsumer>{this.props.children}</RHDTrackingConsumer>
        ) : (
          this.props.children
        )}
      </Provider>
    );
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const ret = prevState ? prevState : {};
    if (!ret.todos) ret.todos = {};
    if (nextProps.planeDetection != prevState.planeDetection) {
      ret.todos["setPlaneDetection"] = nextProps.planeDetection;
      ret.planeDetection = nextProps.planeDetection;
    }
    if (nextProps.imageDetection != prevState.imageDetection) {
      ret.todos["setImageDetection"] = nextProps.imageDetection;
      ret.imageDetection = nextProps.imageDetection;
    }
    if (ret.imageDetection && propDiff(nextProps.images, prevState.images)) {
      ret.todos["setImages"] = true;
      ret.images = nextProps.images;
    }
    if (!ret.todos || Object.keys(ret.todos) == 0) {
      delete ret.todos;
    }
    return ret;
  }
  componentDidUpdate() {
    this.manageTodos();
  }
  componentDidMount() {
    this.manageTodos();
  }
  manageTodos() {
    if (this.state.todos) {
      Object.keys(this.state.todos).forEach(k => {
        if (typeof this[k] == "function") {
          this[k](this.state.todos[k]);
        }
      });
      this.setState({ todos: null }, () => {
        this.setProviderValue();
      });
    }
  }
  setPlaneDetection(newValue) {
    console.log("Adding plane detection");
    if (newValue) addPlaneDetection(this.updatePlanes.bind(this));
    else removePlaneDetection();
  }
  setImageDetection(newValue) {
    if (newValue) addImageDetection(this.updateImages.bind(this));
    else removeImageDetection();
  }
  registeredImages = {};
  setImages() {
    const newKeys = this.state.images
      ? Object.keys(this.state.images).filter(k => {
          return !this.registeredImages[k];
        })
      : [];
    const deadKeys = this.registeredImages
      ? Object.keys(this.registeredImages).filter(k => {
          return !this.state.images[k];
        })
      : [];
    (async () => {
      await Promise.all(
        newKeys.map(k => {
          const { width, url } = this.state.images[k];
          return addRecognizerImage(url, k, width);
        })
      );
      newKeys.forEach(k => {
        this.registeredImages[k] = this.state.images[k];
      });
      if (deadKeys.length) {
        await Promise.all(
          deadKeys.map(k => {
            return removeRecognizerImage(k);
          })
        );
        this.setState(({ images }) => {
          deadKeys.forEach(k => {
            delete images[k];
          });
          return { images: { ...images } };
        });
      }
    })();
  }
  async updatePlanes(data) {
    if (!data) {
      const anchors = cleanAnchors(await getAnchors(data));
      this.setState({ anchors: anchors }, () => {
        this.setProviderValue();
      });
    } else
      switch (data.key) {
        case "planeAnchorAdded":
        case "planeAnchorChanged":
          const k = data.id;
          const anchor = cleanAnchor(data.anchor);
          if (
            !this.state.anchors[k] ||
            propDiff(this.state.anchors[k], anchor, cleanAnchor)
          ) {
            this.setState(
              ({ anchors }) => {
                return { anchors: { ...anchors, [k]: anchor } };
              },
              () => {
                this.setProviderValue();
              }
            );
          }
          break;
        case "planeAnchorRemoved":
        default:
          const anchors = cleanAnchors(await getAnchors(data));
          this.setState({ anchors: anchors }, () => {
            this.setProviderValue();
          });
      }
  }

  async updateImages(data) {
    console.log("Got updateImaged notification", data);

    const anchors = await getAnchors(data);
    this.setState({ anchors: anchors }, () => {
      this.setProviderValue();
    });
  }
}
RHDTrackingProvider.propTypes = {
  planeDetection: PropTypes.bool,
  imageDetection: PropTypes.bool,
  didUpdateAnchors: PropTypes.func
};
export { RHDTrackingProvider, RHDTrackingConsumer };
export default RHDTrackingProvider;
const cleanAnchors = o => {
  var out = {};
  if (!o) return out;
  Object.keys(o).forEach(k => {
    const v = o[k];
    out[k] = cleanAnchor(v);
  });
  return out;
};
const cleanAnchor = v => {
  var out = {};
  if (!v) return out;
  console.log(v);
  if (v.plane) {
    if (v.plane.width)
      v.plane.width = parseFloat(parseFloat(v.plane.width).toFixed(1));
    if (v.plane.height)
      v.plane.height = parseFloat(parseFloat(v.plane.height).toFixed(1));
  }
  return v;
};
const propDiff = (a, b, filterFunc) => {
  if (a === b) return false;
  if ((a && !b) || (!a && b)) return true;
  if (!a && !b) return false;
  const af = filterFunc ? filterFunc(a) : a;
  const bf = filterFunc ? filterFunc(b) : b;

  const afk = Object.keys(af);
  const bfk = Object.keys(bf);
  if (afk.length != bfk.length) return true;
  if (
    afk.filter(k => {
      return bfk.indexOf(k) === -1;
    }).length
  )
    return true;
  if (
    afk.filter(k => {
      return bf[k] != af[k];
    }).length
  )
    return true;
};
