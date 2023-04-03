import * as mapHand from "./mapHandler";
import Point from "ol/geom/Point.js";
import Feature from "ol/Feature.js";
import GeoJSON from "ol/format/GeoJSON.js";
import * as heatHand from "./HeatMapHandler";

export let earthDataFeatures = [];

export async function handleClusterLayer(coords, radius, startDate, endDate) {
  const res = await fetch(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=
        ${coords[1]}&longitude=${coords[0]}&starttime=${startDate}&endtime=${endDate}&maxradiuskm=${radius}&minmagnitude=3`
  );
  addFeaturesToLayer(await res.json());
}

function addFeaturesToLayer(res) {
  let earthquakeData = res.features;
  let pointsList = [];
  earthquakeData.forEach((f) => {
    let fPoint = new Feature({
      geometry: new Point(f.geometry.coordinates),
      title: f.properties.title,
      place: f.properties.place,
      mag: f.properties.mag,
      url: f.properties.url,
      magType: f.properties.magType,
    });
    pointsList.push(fPoint);
  });
  mapHand.earthquakeDataLayer.getSource().getSource().addFeatures(pointsList);
  earthDataFeatures.push(...pointsList);
  if (heatHand.heatAdded) {
    heatHand.addFeaturesToHeatMapSource(pointsList);
  }
}

export function setClusterStyle(source) {
  let sumMag = 0;
  const features = source.get("features");
  features.forEach((feat) => {
    sumMag += +feat.values_.mag;
  });
  let avgMag = (sumMag / features.length).toFixed(1);
  let color = "#3399CC";
  if (avgMag < 4) {
    color = "green";
  } else if (avgMag < 6) {
    color = "yellow";
  } else {
    color = "red";
  }
  const style = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 15,
      stroke: new ol.style.Stroke({
        color: "#fff",
      }),
      fill: new ol.style.Fill({
        color: color,
      }),
    }),
    text: new ol.style.Text({
      text: "" + avgMag,
      fill: new ol.style.Fill({
        color: "black",
      }),
    }),
  });
  return style;
}
export function downloadEarthquakeFeatures() {
  const format = new GeoJSON({ featureProjection: "EPSG:4326" });
  const json = format.writeFeatures(earthDataFeatures);
  var blob = new Blob([json], {
    type: "application/json",
  });
  var url = URL.createObjectURL(blob);
  // window.open(url, "_blank");
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "EarthquakeData.geojson";
  link.click();
}
