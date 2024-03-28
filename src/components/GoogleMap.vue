<template>
  <div>
    <capacitor-google-map
      ref="mapRef"
      style="display: inline-block; width: 100vw; height: 86vh"
    >
    </capacitor-google-map>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, onUnmounted } from "vue";
import { GoogleMap } from "@capacitor/google-maps";
import { mapService } from "@/services/map-service";
import { Coordinate } from "@/types/supabase-global"

const mapRef = ref<HTMLElement>();
const markerIds = ref<string[] | undefined>();
//const googleApiKey = "AIzaSyCJbAjIZqv32gJ4BeiuomscFObUAUGe-AM"
let newMap: GoogleMap;
const currentLocation = ref<Coordinate>();



// EVENTS
const emits = defineEmits<{
  (event: "onMarkerClicked", info: any): void;
  (event: "onMapClicked"): void;
}>();

onMounted(async () => {
  console.log("mounted ", mapRef.value);
  await nextTick();
  await createMap();
});

// remove markers on unmount
onUnmounted(() => {
  console.log("onunmounted");
  newMap.removeMarkers(markerIds?.value as string[]);
});

const addSomeMarkers = async (newMap: GoogleMap) => {
  markerIds?.value && newMap.removeMarkers(markerIds?.value as string[]);
  const image = "/public/home-sharp.svg";

  const markerData = await mapService.getAllCases();

  // each point from supabase
  const markers = markerData.map((item) => {
    return{
      coordinate: {lat: item.lat, lng: item.long},
      title: item.title,
      iconUrl: ""
    }
  });

  //Location from User
  markers.push({
    coordinate: {lat: currentLocation.value!.latitude, lng: currentLocation.value!.longitude},
    title: "Mein Standort",
    iconUrl: image
  });

  console.log(markers[2]);

  markerIds.value = await newMap.addMarkers(markers);
};

async function createMap() {
  if (!mapRef.value) return;

  currentLocation.value = await mapService.currentLocation();

  // render map using capacitor plugin
  newMap = await GoogleMap.create({
    id: "map-id",
    element: mapRef.value,
    apiKey: import.meta.env.VITE_APP_YOUR_API_KEY_HERE as string, //use apikey here
    config: {
      center: {
        lat: currentLocation.value!.latitude,
        lng: currentLocation.value!.longitude,
      },
      zoom: 15,
    },
  });

  newMap.enableCurrentLocation(true);

  // add markers to map
  addSomeMarkers(newMap);

  // Set Event Listeners...
  // Handle marker click, send event back to parent
  newMap.setOnMarkerClickListener((event) => {
    emits("onMarkerClicked", event);
  });

  // Handle map click, send event back to parent
  newMap.setOnMapClickListener(() => {
    emits("onMapClicked");
  });
}
</script>
