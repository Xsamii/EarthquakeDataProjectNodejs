import { Heatmap as HeatmapLayer } from "ol/layer.js";

import VectorSource from "ol/source/Vector.js";

export let heatAdded = false;

const heatLayer = new HeatmapLayer({
  source: new VectorSource({}),
  blur: 25,
  radius: 15,
  zIndex: 5,
  weight: function (feature) {
    const mag = feature.get("mag");
    return mag;
  },
  layerName: "heatMapLayer",
});

export function addFeaturesToHeatMapSource(features) {
  heatLayer.getSource().addFeatures(features);
}
export function addHeatLayerToMap(map) {
  map.addLayer(heatLayer);
  heatAdded = true;
}
export function addHeatLayerToControls() {
  const layehrControler = document.querySelector("#layers-controller");
  const html = `<label for="earthquakelayer">HeatMap Layer</label>
   <input
     type="checkbox"
     name="HeatMap"
     id="heatMapLayer"
     checked
   />`;
  layehrControler.insertAdjacentHTML("beforeend", html);
}
