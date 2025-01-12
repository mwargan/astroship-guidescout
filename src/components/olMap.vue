<template>
  <div id="map" class="map rounded-lg overflow-hidden" tabindex="0"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { useGeographic } from "ol/proj";

import { GeoJSON } from "ol/format";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";

const geometry = defineProps({
  type: {
    type: String,
    required: true,
  },
  coordinates: {
    type: Array,
    required: true,
  },
});

onMounted(() => {
  useGeographic();

  const centerFromGeometry = new GeoJSON()
    .readFeatures({
      type: "Feature",
      geometry: {
        type: geometry.type,
        coordinates: geometry.coordinates,
      },
    })[0]
    .getGeometry()
    ?.getExtent();

  const map = new Map({
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    target: "map",
    view: new View({
      center: centerFromGeometry ? centerFromGeometry : fromLonLat([0, 0]),
      zoom: 13,
    }),
  });

  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures({
      type: "Feature",
      geometry: {
        type: geometry.type,
        coordinates: geometry.coordinates,
      },

      // Color of the polygon
      properties: {
        color: "red",
      },
    }),
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  map.addLayer(vectorLayer);
});
</script>

<style>
@import "../../node_modules/ol/ol.css";

.map {
  width: 100%;
  height: 100%;
  /* Adjust as needed */
}

.map:focus {
  outline: #4a74a8 solid 0.15em;
}
</style>
