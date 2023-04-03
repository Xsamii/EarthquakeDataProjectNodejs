import * as gCoding from "./Geocoding";
import * as mapHand from "./mapHandler";
import * as clustHand from "./ClusterHnadler";
import * as heatHand from "./HeatMapHandler";
import * as interHand from "./InteractiolnHandler";
const searchList = document.querySelector("#results-list");
let selectedPlace;
export let selectedPlaceCoords;
let placeList = [];

export function resultClickHandler(osmId, map) {
  searchList.innerHTML = "";
  const targetPlace = gCoding.gCodingFeatures.find(
    (f) => f.properties.osm_id == osmId
  );
  selectedPlace = targetPlace;
  selectedPlaceCoords = targetPlace.geometry.coordinates;
  mapHand.zoomToCoords(selectedPlaceCoords, map);
  mapHand.addPinToCoords(selectedPlaceCoords, map);
}

export function formSubmitHandler(radius, startDate, endDate) {
  startDate == "" && (startDate = "2018-01-01");
  endDate == "" && (endDate = "2019-01-02");
  mapHand.createBuffer(selectedPlaceCoords, radius);
  clustHand.handleClusterLayer(selectedPlaceCoords, radius, startDate, endDate);
  addHistory(selectedPlace);
  // heatHand.addFeaturesToHeatMapSource(clustHand.earthDataFeatures);
}

function addHistory(place) {
  placeList.push(selectedPlace);
  const html = `<option value="${place.properties.osm_id}">${place.properties.display_name}</option>`;
  document
    .querySelector("#search-history")
    .insertAdjacentHTML("beforeend", html);
}

export function goToPlace(osmId, map) {
  placeList.forEach((feat) => {
    feat.properties.osm_id == osmId &&
      mapHand.zoomToCoords(feat.geometry.coordinates, map);
  });
}

export function handelHeatMap(map) {
  heatHand.addFeaturesToHeatMapSource(clustHand.earthDataFeatures);
  heatHand.addHeatLayerToMap(map);
  heatHand.addHeatLayerToControls();
}

export function downloadJson() {
  clustHand.downloadEarthquakeFeatures();
}

export function changeInteractionEventHandler(map, layerName) {
  interHand.changeeditedLayer(map, layerName);
}

export function addEarthquakeDataToMap(coord) {
  mapHand.createBuffer(coord, 1000);
  clustHand.handleClusterLayer(coord, 1000, "2018-01-01", "2019-01-02");
  // heatHand.addFeaturesToHeatMapSource(clustHand.earthDataFeatures);
}
