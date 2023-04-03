import VectorLayer from "ol/layer/Vector.js";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector.js";
import { Cluster, OSM } from "ol/source.js";
import Point from "ol/geom/Point.js";
import Circle from "ol/geom/Circle.js";
import Feature from "ol/Feature.js";
import { Fill, Stroke, Style, Icon } from "ol/style.js";
import { transform } from "ol/proj";
import * as clustHand from "./ClusterHnadler";

const pinlayer = new VectorLayer({
  layerName: "pinLayer",
  source: new VectorSource(),
  style: new Style({
    image: new Icon({
      src: "../imgs/earthQuakespin.png",
      scale: 0.07,
    }),
  }),
});

const bufferLayer = new VectorLayer({
  layerName: "circleLayer",
  source: new VectorSource(),
  style: new Style({
    fill: new Fill({
      color: "rgba(255,255,204,0.8)",
    }),
    stroke: new Stroke({
      color: "black",
    }),
  }),
});

export function addBaseMaps(map) {
  const worldImagery = new TileLayer({
    source: new ol.source.XYZ({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      maxZoom: 19,
    }),
    visible: false,
    title: "Esri",
    layerName: "ESRIbase",
    layerType: "base",
  });
  const natGeoLayer = new TileLayer({
    source: new ol.source.XYZ({
      url: "https://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
    }),
    visible: false,
    title: "NatGeo",
    layerName: "tileNATGEObase",
    layerType: "base",
  });
  const osmLayer = new TileLayer({
    source: new OSM(),
    title: "OSM",
    layerName: "NATGEObase",
    layerType: "base",
  });
  map.addLayer(worldImagery);
  map.addLayer(natGeoLayer);
  map.addLayer(osmLayer);
}
export function changeBaseMap(layerName, map) {
  map.getLayers().forEach((lay) => {
    if (lay.values_.layerType == "base") {
      if (lay.values_.title == layerName) {
        lay.setVisible(true);
      } else {
        lay.setVisible(false);
      }
    }
  });
}

export function mangeVisibleLayer(target, map) {
  map.getLayers().forEach((lay) => {
    if (lay.values_.layerName == target.id) {
      lay.setVisible(target.checked);
    }
  });
}

export const earthquakeDataLayer = new VectorLayer({
  layerName: "earthquakelayer",
  source: new Cluster({
    distance: 100,
    minDistance: 10,
    source: new VectorSource(),
  }),
  layerNmae: "earthquakeClusterLayer",
  layerType: "cluster",
  style: clustHand.setClusterStyle,
});

export function addPinAndBufferLayerToMap(map) {
  map.addLayer(pinlayer);
  map.addLayer(bufferLayer);
  map.addLayer(earthquakeDataLayer);
}

export function addPinToCoords(coords) {
  const pin = new Feature({
    geometry: new Point(coords),
  });
  pinlayer.getSource().addFeature(pin);
}

export function zoomToCoords(coords, map) {
  map.getView().animate({ center: coords }, { zoom: 5 });
}

export function createBuffer(coords, radiusInKM) {
  let nCoords = new transform(coords, "EPSG:4326", "EPSG:3857");
  const circleFeature = new Feature({
    geometry: new Circle(nCoords, radiusInKM * 1400).transform(
      "EPSG:3857",
      "EPSG:4326"
    ),
  });
  bufferLayer.getSource().addFeature(circleFeature);
}
