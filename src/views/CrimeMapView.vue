<template>
  <ion-page v-if="markerDataLoaded" class="crimeMap">
    <ion-header :translucent="true">
      <ion-toolbar class="crimeHeader">
        <ion-title>Crime Map</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :scroll-y="true">
      <my-map :markerData="markerData" @onMapClicked="mapClicked" @onMarkerClicked="markerClicked"></my-map>
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
  IonIcon,
  IonFab, 
  IonFabButton, 
  modalController,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import MyMap from "../components/GoogleMap.vue";
import CrimeProfile from "../components/CrimeProfile.vue";
import { Capacitor } from "@capacitor/core";
import { mapService } from "@/services/map-service";
import { ListOfCases } from "@/types/supabase-global";
import { add} from "ionicons/icons";

const markerIsOpen = ref<boolean>(false);

// data for the map
let markerData: ListOfCases = [];
const markerDataLoaded = ref<boolean>(false);

onMounted(async () => {
  const currentLocation = await mapService.currentLocation();
  markerData = await mapService.getNearbyCases(currentLocation.latitude, currentLocation.longitude, 100);
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
    console.log(markerToPass);
    openModal(markerToPass);
  }
};

/*        <ion-list lines="inset" :inset=true>
          <ion-item v-for="(item, index) of markerData" :key="index">
            <ion-label>{{ item.title }}</ion-label>
            <ion-label>Ort</ion-label>
            <ion-label>{{ item.status }}</ion-label>
          </ion-item>
        </ion-list>
*/

</script>
