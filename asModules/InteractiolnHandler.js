import { Draw, Modify, Snap } from "ol/interaction.js";
import { Fill, Stroke, Style, Icon } from "ol/style.js";
import * as evtHand from "./EventsHandlers";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";

let popupElement;

const lineLayer = new VectorLayer({
  source: new VectorSource(),
  style: {
    "fill-color": "#2f8a7f",
    "stroke-color": `#17238a`,
    "stroke-width": 2,
    "circle-radius": 7,
    "circle-fill-color": `#2f8a7f`,
  },
  type: "LineString",
  name: "lineLayer",
});

const polygonLayer = new VectorLayer({
  source: new VectorSource(),
  style: {
    "fill-color": "#2f8a7f",
    "stroke-color": `#17238a`,
    "stroke-width": 2,
    "circle-radius": 7,
    "circle-fill-color": `#2f8a7f`,
  },
  type: "Polygon",
  name: "polygonLayer",
});

const drawPinLayer = new VectorLayer({
  source: new VectorSource(),
  style: new Style({
    image: new Icon({
      src: "../imgs/mouseclickpin.png",
      scale: 0.07,
    }),
  }),
  type: "Point",
  name: "drawPinLayer",
});
export function interactionHandeler(map) {
  map.addLayer(lineLayer);
  map.addLayer(polygonLayer);
  map.addLayer(drawPinLayer);
  // changeeditedLayer(map, "drawPinLayer");
}

function createPopUp(map, value) {
  if (popupElement) {
    popupElement.parentNode.removeChild(popupElement);
  }
  popupElement = document.createElement("div");
  popupElement.className = "pop-up";
  popupElement.innerHTML = value;
  const popUp = new ol.Overlay({
    element: popupElement,
    offset: [15, 0],
    positioning: "center-left",
  });
  map.addOverlay(popUp);
  return popUp;
}

export function changeeditedLayer(map, layerName) {
  const layers = map.getLayers();
  const interactions = map.getInteractions();
  interactions.forEach((i) => {
    if (i instanceof Draw) {
      i.setActive(false);
    }
  });
  let currentLayer;
  layers.forEach((lay) => {
    if (lay.get("name") == layerName) {
      currentLayer = lay;
    }
  });
  setInteraction(map, currentLayer);
}

function setInteraction(map, layer) {
  let value;
  const drawInteraction = new Draw({
    source: layer.getSource(),
    type: layer.get("type"),
  });
  map.addInteraction(drawInteraction);

  drawInteraction.on("drawend", function (e) {
    popupElement = undefined;
    // printGeom(e.feature);
  });

  drawInteraction.on("drawstart", function (e) {
    const feature = e.feature.getGeometry();
    if (feature.constructor.name == "LineString") {
      feature.on("change", function (e) {
        const coords = e.target.getLastCoordinate();
        const length = Math.round(e.target.getLength()) * 111.1 + " KM";
        value = length;
        const linePopUp = createPopUp(map, value);
        linePopUp.setPosition(coords);
        // linePopUp = undefined;
      });
    } else if (feature.constructor.name == "Polygon") {
      feature.on("change", function (e) {
        const area = (e.target.getArea() * 111.1 * 111.1).toFixed(2) + " fed";
        value = area;
        const polygonPOp = createPopUp(map, value);
        polygonPOp.setPosition(e.target.getLastCoordinate());
      });
    } else if (feature.constructor.name == "Point") {
      const coords = feature.getCoordinates();
      const pointPop = createPopUp(map, coords);
      pointPop.setPosition(coords);
      evtHand.addEarthquakeDataToMap(coords);
    }
  });

  return drawInteraction;
}
