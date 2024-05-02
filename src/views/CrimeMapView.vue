<template>
  <ion-page v-if="markerDataLoaded">
    <HeaderComponent />
    <ion-content :scroll-y="true" class="crimeMap">
      <my-map :markerData="markerData" @onMarkerChange="receiveMarkerData" @onMapClicked="mapClicked"
        @onMarkerClicked="markerClicked"></my-map>
      <ion-modal ref="modalRef" :can-dismiss="canDismiss" color="primary">
        <crime-profile :markerData="markerToPass" :modal="modalRef"/>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage,
  onIonViewDidEnter,
  IonModal
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import MyMap from "../components/GoogleMap.vue";
import CrimeProfile from "../components/CrimeProfile.vue";
import HeaderComponent from '../components/Header.vue';
import { mapService } from "@/services/map-service";
import { FilteredCases, Coordinate } from "@/types/supabase-global";

const modalRef = ref();

// data for the map
let markerData: FilteredCases = [];
const markerDataLoaded = ref<boolean>(false);

let markerToPass: FilteredCases = [];

const canDismiss = async () => {
  return true;
};


onIonViewDidEnter(async () => {
  markerDataLoaded.value = false;
  const currentLocation = await mapService.currentLocation();
  markerData = await mapService.getFilteredCases(currentLocation.latitude, currentLocation.longitude, 100, null, null);
  markerDataLoaded.value = true;
});

onMounted(async () => {
  const currentLocation = await mapService.currentLocation();
  markerData = await mapService.getFilteredCases(currentLocation.latitude, currentLocation.longitude, 100, null, null);
  markerDataLoaded.value = true;
  console.log(markerData);
});

const mapClicked = () => {
  console.log("mapClicked");
};

const getMarkerInfo = (marker: { lat: number; long: number }): FilteredCases => {
  return markerData.filter(
    (m) =>
      m.long === marker.long &&
      m.lat === marker.lat
  );
};

const markerClicked = (event: Coordinate) => {
  console.log(event);
  markerToPass = getMarkerInfo({ lat: event.latitude, long: event.longitude });
  if (markerToPass.length == 0) {
    return;
  }
  modalRef.value.$el.present();
}

const receiveMarkerData = (event: FilteredCases): void => {
  markerData = event;
}

</script>

<style>
ion-content {
  --background: transparent: !important;
}
</style>
