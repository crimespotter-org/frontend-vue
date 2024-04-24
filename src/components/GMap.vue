<template>
    <div class="map" ref="mapDivRef" hidden="true"></div>
</template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { Loader } from "@googlemaps/js-api-loader";
  
  // the google map object
  const map = ref();
  // the map element in the templste
  const mapDivRef = ref(null);
  
  // load in the google script
  onMounted(() => {
    // key is is the .env file
    const key = "AIzaSyCJbAjIZqv32gJ4BeiuomscFObUAUGe-AM";
  
    // create the script element to load
    const googleMapScript = document.createElement("SCRIPT");
    googleMapScript.setAttribute(
      "src",
      `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`
    );
    googleMapScript.setAttribute("defer", "");
    googleMapScript.setAttribute("async", "");
    document.head.appendChild(googleMapScript);
    initMap();
  });
  
  /**
   * this function is called as soon as the map is initialized
   */
  

function initMap() {
    map.value = new window.google.maps.Map(mapDivRef.value!, {
      mapTypeId: "hybrid",
      zoom: 8,
      disableDefaultUI: false,
      center: { lat: 38.0, lng: -77.01 },
    });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

  </script>
  
  <style lang="css" scoped>
  .map {
    width: 100%;
    height: 100%;
    background-color: azure;
  }
  </style>
  