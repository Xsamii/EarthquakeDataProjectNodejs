import ZoomSlider from "ol/control/ZoomSlider.js";
import Control from "ol/control/Control.js";

export function controllerHandler(map) {
  // Rotate Controls-----------------Rotate Right-------------------------
  var button = document.createElement("button");
  button.innerHTML = "R";
  var handleRotateRight = function (e) {
    var rotation = map.getView().getRotation();
    map.getView().setRotation(rotation + Math.PI / 6);
  };
  button.addEventListener("click", handleRotateRight);
  var element = document.createElement("div");
  element.className = "rotate-right ol-control"; // taking style of defult conrols ol-conrol
  element.appendChild(button);
  var RotateRightControl = new Control({
    //creating new control
    element: element,
  });

  // ---------------------North Button------------------------
  class RotateNorthControl extends ol.control.Control {
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
      const options = opt_options || {};
      const button = document.createElement("button");
      button.innerHTML = "N";
      const element = document.createElement("div");
      element.className = "rotate-north ol-unselectable ol-control";
      element.appendChild(button);
      super({
        element: element,
        target: options.target,
      });
      button.addEventListener(
        "click",
        this.handleRotateNorth.bind(this),
        false
      );
    }
    handleRotateNorth() {
      this.getMap().getView().setRotation(0);
    }
  }
  const Nbtn = new RotateNorthControl();

  ////-------------------------------Rotate Left------------------------------------------
  var buttn = document.createElement("button");
  buttn.innerHTML = "L";
  var handleRotateLeft = function (e) {
    var rot = map.getView().getRotation();
    map.getView().setRotation(rot - Math.PI / 6);
  };
  buttn.addEventListener("click", handleRotateLeft, false);
  var elm = document.createElement("div");
  elm.className = "rotate-left ol-unselectable ol-control";
  elm.appendChild(buttn);
  var RotateLeftControl = new Control({
    element: elm,
  });

  // Zoom Control
  const zoomslider = new ZoomSlider();

  map.addControl(RotateLeftControl);
  map.addControl(RotateRightControl);
  map.addControl(Nbtn);
  map.addControl(zoomslider);
}
