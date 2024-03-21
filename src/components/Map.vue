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
import { Geolocation } from "@capacitor/geolocation";

const mapRef = ref<HTMLElement>();
const markerIds = ref<string[] | undefined>();
let newMap: GoogleMap;

export interface Location{
  name: string;
  latitude: number;
  longitude: number;
} 

const location = ref<Location>();

// PROPS
const props = defineProps<{
  markerData: { coordinate: any; title: string; iconUrl: string}[];
}>();

// EVENTS
const emits = defineEmits<{
  (event: "onMarkerClicked", info: any): void;
  (event: "onMapClicked"): void;
}>();

onMounted(async () => {
  console.log("mounted ", mapRef.value);
  await currentLocation()
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

  // Plot each point on the map
  const markers = props.markerData.map(({ coordinate, title, iconUrl }) => {
    return {
      coordinate,
      title,
      iconUrl
    };
  });

  const image = "/public/House.png"

  //Location from User
  markers.push({
    coordinate: {lat: location.value?.latitude, lng: location.value?.longitude},
    title: "Mein Standort",
    iconUrl: image
  });

  markerIds.value = await newMap.addMarkers(markers);
};

const currentLocation = async () => {
  await Geolocation.getCurrentPosition().then((coordinates) => {
    location.value =
    {
      name: "Mein Standort",
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude
    }});
};

async function createMap() {
  if (!mapRef.value) return;

  currentLocation();

  // render map using capacitor plugin
  newMap = await GoogleMap.create({
    id: "map-id",
    element: mapRef.value,
    apiKey: import.meta.env.VITE_APP_YOUR_API_KEY_HERE as string,
    config: {
      center: {
        lat: location.value!.latitude,
        lng: location.value!.longitude,
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
