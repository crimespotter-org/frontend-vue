<template>
  <ion-page>
    <HeaderComponent />  
    <ion-content :scroll-y="true">
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
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonPopover,
  modalController,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import MyMap from "../components/GoogleMap.vue";
import CrimeProfile from "../components/CrimeProfile.vue";
import HeaderComponent from '../components/Header.vue';
import { Capacitor } from "@capacitor/core";
import { mapService } from "@/services/map-service";
import { ListOfCases } from "@/types/supabase-global";

const markerIsOpen = ref<boolean>(false);

// data for the map
let markerData: ListOfCases = [];
const markerDataLoaded = ref<boolean>(false);

onMounted(async () => {
  const currentLocation = await mapService.currentLocation();
  markerData = await mapService.getFilteredCases(currentLocation.latitude, currentLocation.longitude, 100, null, null);
  markerDataLoaded.value = true;
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

const markerClicked = (event: {latitude: number, longitude: number, mapId: string, markerId: string, snippet: string, title: string}) => {
  if (!Capacitor.isNativePlatform()) {
    const markerToPass = getMarkerInfo({lat: event.latitude, long: event.longitude});
    if(markerToPass.length == 0){
      return;
    }
    openModal(markerToPass);
  }
}

const receiveMarkerData = (event: ListOfCases) : void =>{
  markerData = event;
}

</script>
