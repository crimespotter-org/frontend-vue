<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Crime Map</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item>
      <ion-select label="Radius" 
      placeholder="0km" 
      aria-label="Range"
      @ionChange="handleRangeChange" >
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
      <my-map
        @onMapClicked="mapClicked"
        @onMarkerClicked="markerClicked"
      ></my-map>
      <ion-popover
        :is-open="markerIsOpen"
        size="cover"
        @did-dismiss="markerIsOpen = false">
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
  IonItem,
  IonSelect,
  IonSelectOption 
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import MyMap from "../components/GoogleMap.vue";
import CrimeProfile from "../components/CrimeProfile.vue";
import { Capacitor } from "@capacitor/core";
import { mapService } from "@/services/map-service";
import { AllCases } from "@/types/supabase-global";

const markerIsOpen = ref<boolean>(false);

// data for the map
let markerData: AllCases = [];

onMounted(async () => {
  markerData = await mapService.getAllCases();
  const currentLocation = await mapService.currentLocation();
  markerData.push({
      id: "0",
      title: "Mein Standort",
      summary: "Mein aktueller Standort",
      status: "",
      created_by: "",
      created_at: new Date().getDate().toString(),
      lat: currentLocation.latitude,
      long: currentLocation.longitude
  })
});

const openModal = async (markerData: AllCases) => {
  console.log("marker to pass");
  console.log(markerData)
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

const getMarkerInfo = (marker: { lat: number; long: number }) : AllCases => {
  return markerData.filter(
    (m) =>
      m.long === marker.long &&
      m.lat === marker.lat
  );
};

const markerClicked = (event: {latitude: number, longitude: number, mapId: string, markerId: string, snippet: string, title: string}) => {
  // only use dialog in web since we doesnt show info window
  if (!Capacitor.isNativePlatform()) {
    const markerToPass = getMarkerInfo({lat: event.latitude, long: event.longitude});
    openModal(markerToPass);
  }
};

const handleRangeChange = (event: {detail: {value: number}}) => {
  console.log(event.detail.value);
}

</script>
