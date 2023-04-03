// import "./style.css";
import { Map, View } from "ol";
import * as gCoding from "./asModules/Geocoding";
import * as evHand from "./asModules/EventsHandlers";
import * as mapHand from "./asModules/mapHandler";
import { defaults } from "ol/control/defaults";
import * as contHand from "./asModules/ConrolsHandler";
import * as ineterHand from "./asModules/InteractiolnHandler";

//HTML Elements
const baseMap = document.querySelector("#selectbox");
const searchbox = document.querySelector("#place");
const radiustb = document.querySelector("#radius");
const submitBtn = document.querySelector("#submit");
const searchForm = document.querySelector("form");
const searchList = document.querySelector("#results-list");
const searchDiv = document.querySelector(".search-results");
const startDateField = document.querySelector("#startdate");
const endDateField = document.querySelector("#enddate");
const baseMapSelectBox = document.querySelector("#mapBaseSelect");
const historySelectbox = document.querySelector("#search-history");
const heatMapBtn = document.querySelector("#addHeatMap");
const downloadBtn = document.querySelector("#downloadEarthquakeData");
const interactionController = document.querySelector("#interaction-controller");
//first step adding a map
export const map = new Map({
  target: "map",
  view: new View({
    projection: "EPSG:4326",
    center: [0, 0],
    zoom: 2,
  }),
  controls: new defaults({
    zoom: true,
    attribution: true,
    rotate: true,
  }),
});

mapHand.addBaseMaps(map);

//adding Main Layers to the map
mapHand.addPinAndBufferLayerToMap(map);

// mapHand.addControlsToMap(map);
contHand.controllerHandler(map);

//Handelling interactions
ineterHand.interactionHandeler(map);
//Handeling GeoCoding
searchbox.addEventListener("input", (e) => {
  gCoding.inputHandler(e.target.value);
});
//handling click on the document
document.addEventListener("click", (e) => {
  e.target.id == "result-place" &&
    evHand.resultClickHandler(e.target.value, map);
  e.target.parentNode.id == "layers-controller" &&
    mapHand.mangeVisibleLayer(e.target, map);
});
//submit form handeling
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  evHand.formSubmitHandler(
    radiustb.value,
    startDateField.value,
    endDateField.value
  );
});

baseMapSelectBox.addEventListener("change", (e) => {
  mapHand.changeBaseMap(e.target.value, map);
});
historySelectbox.addEventListener("change", (e) => {
  e.target.value != " " && evHand.goToPlace(e.target.value, map);
});
heatMapBtn.addEventListener("click", (e) => {
  evHand.handelHeatMap(map);
});

downloadBtn.addEventListener("click", (e) => {
  evHand.downloadJson();
});

interactionController.addEventListener("click", (e) => {
  evHand.changeInteractionEventHandler(map, e.target.id);
});
