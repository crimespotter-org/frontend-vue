<template>
  <ion-page v-if="markerDataLoaded">
    <HeaderComponent />  
    <ion-content :scroll-y="true" class="crimeMap">
      <my-map :markerData="markerData" @onMarkerChange="receiveMarkerData" @onMapClicked="mapClicked" @onMarkerClicked="markerClicked"></my-map>
      <ion-popover :is-open="markerIsOpen" size="cover" @did-dismiss="markerIsOpen = false">
        <crime-profile :markerData="markerData"></crime-profile>
      </ion-popover>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonPopover,
  modalController,
  onIonViewDidEnter
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import MyMap from "../components/GoogleMap.vue";
import CrimeProfile from "../components/CrimeProfile.vue";
import HeaderComponent from '../components/Header.vue';
import { mapService } from "@/services/map-service";
import { FilteredCases, ListOfCases, Coordinate } from "@/types/supabase-global";

const markerIsOpen = ref<boolean>(false);

// data for the map
let markerData: FilteredCases = [];
const markerDataLoaded = ref<boolean>(false);

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

const openModal = async (markerData: ListOfCases) => {
  const modal = await modalController.create({
    component: CrimeProfile,
    componentProps: {
      markerData,
    },
    initialBreakpoint: 0.8,
    breakpoints: [0, 0.8],
    backdropBreakpoint: 0,
    showBackdrop: false,
    backdropDismiss: true,
  });

  modal.present();
};

const mapClicked = () => {
  console.log("mapClicked");
};

const getMarkerInfo = (marker: { lat: number; long: number }) : ListOfCases => {
  return markerData.filter(
    (m) =>
      m.long === marker.long &&
      m.lat === marker.lat
  );
};

const markerClicked = (event: Coordinate) => {
    console.log(event);
    const markerToPass = getMarkerInfo({lat: event.latitude, long: event.longitude});
    if(markerToPass.length == 0){
      return;
    }
    openModal(markerToPass);
}

const receiveMarkerData = (event: FilteredCases) : void =>{
  markerData = event;
}

</script>

<style>
ion-content {
  --background: transparent: !important;
}
</style>
