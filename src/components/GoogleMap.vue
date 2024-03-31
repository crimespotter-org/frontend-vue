<template>
  <div>
    <ion-grid>
      <ion-row>
        <ion-col size="2">
          <ion-fab>
            <ion-fab-button color="secondary">
              <ion-icon :icon="filterOutline"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </ion-col>
        <ion-col size="6">
          <ion-searchbar color="tertiary"></ion-searchbar>
        </ion-col>
        <ion-col size="4">
          <ion-item>
            <ion-select aria-label="Range" placeholder="10km" @ionChange="handleRangeChange">
              <ion-select-option value="5">5 km</ion-select-option>
              <ion-select-option value="10">10 km</ion-select-option>
              <ion-select-option value="20">20 km</ion-select-option>
              <ion-select-option value="50">50 km</ion-select-option>
              <ion-select-option value="100">100 km</ion-select-option>
              <ion-select-option value="200">200 km</ion-select-option>
              <ion-select-option value="500">500 km</ion-select-option>
              <ion-select-option value="1000">1000 km</ion-select-option>
              <ion-select-option value="10000">10000 km</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
    <capacitor-google-map ref="mapRef" style="display: inline-block; width: 100vw; height: 86vh">
    </capacitor-google-map>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, onUnmounted } from "vue";
import { GoogleMap } from "@capacitor/google-maps";
import { mapService } from "@/services/map-service";
import { Coordinate, ListOfCases } from "@/types/supabase-global";
import { filterOutline} from "ionicons/icons"
import{
  IonItem,
  IonSelect,
  IonSelectOption,
  //IonList,
  //IonLabel,
  //IonModal,
  IonSearchbar,
  IonCol, 
  IonGrid, 
  IonRow,
  IonIcon,
  IonFab, 
  IonFabButton 
} from "@ionic/vue";

const mapRef = ref<HTMLElement>();
const markerIds = ref<string[] | undefined>();
//const googleApiKey = "AIzaSyCJbAjIZqv32gJ4BeiuomscFObUAUGe-AM"
let newMap: GoogleMap;
const currentLocation = ref<Coordinate>();
let listOfCases: ListOfCases = [];

const props = defineProps<{
  markerData: ListOfCases;
}>();

// EVENTS
const emits = defineEmits<{
  (event: "onMarkerClicked", info: any): void;
  (event: "onMapClicked"): void;
}>();

onMounted(async () => {
  console.log("mounted ", mapRef.value);
  listOfCases = props.markerData;
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

  // each point from supabase
  const markers = listOfCases.map((item) => {
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

const handleRangeChange = async(event: {detail: {value: number}}) => {
  console.log(event.detail.value);
  listOfCases = await mapService.getNearbyCases(currentLocation.value!.latitude, currentLocation.value!.longitude, event.detail.value); 
  await addSomeMarkers(newMap);
};
</script>
