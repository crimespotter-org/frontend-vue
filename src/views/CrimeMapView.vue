<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Crime Map</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item>
      <ion-select label="Radius" placeholder="0km">
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
        :markerData="markerData"
        @onMapClicked="mapClicked"
        @onMarkerClicked="markerClicked"
      ></my-map>
      <ion-popover
        :is-open="markerIsOpen"
        size="cover"
        @did-dismiss="markerIsOpen = false"
      >
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
import { ref } from "vue";
import MyMap from "../components/Map.vue";
import CrimeProfile from "../components/CrimeProfile.vue";
import { Capacitor } from "@capacitor/core";

const markerIsOpen = ref<boolean>(false);

// data for the map
const markerData = [
  {
    coordinate: { lat: 37.769, lng: -122.446 },
    title: "title one",
    iconUrl: ""
  },
  {
    coordinate: { lat: 37.769, lng: -122.45 },
    title: "title two",
    iconUrl: ""
  },
];

const openModal = async (marker: any) => {
  const modal = await modalController.create({
    component: CrimeProfile,
    componentProps: {
      marker,
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

const getMarkerInfo = (marker: { latitude: number; longitude: number }) => {
  return markerData.filter(
    (m) =>
      m.coordinate.lat === marker.latitude &&
      m.coordinate.lng === marker.longitude
  )[0];
};

const markerClicked = (event: any) => {
  console.log(event);

  // only use dialog in web since we doesnt show info window
  if (!Capacitor.isNativePlatform()) {
    openModal(getMarkerInfo(event));
  }
};


</script>
