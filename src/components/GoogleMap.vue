<template>
  <ion-page class="crimeMap">
    <ion-fab slot="fixed" vertical="bottom" horizontal="start">
      <ion-fab-button color="secondary">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <ion-grid>
      <ion-row>
        <ion-col size="2">
          <ion-button id="open-modal" expand="block" color="secondary">
            <ion-icon :icon="filterOutline"></ion-icon>
          </ion-button>
        </ion-col>
        <ion-col size="10">
          <ion-searchbar color="tertiary" autocomplete="on" @ion-change="getAddress">
          </ion-searchbar>
        </ion-col>
      </ion-row>
    </ion-grid>
    <div id="map" style="height: 93.8%; width: 100%; position: absolute">
    </div>
    <ion-modal ref="modal" trigger="open-modal" class="crimeMap" :initial-breakpoint="0.50">
      <ion-header class="crimeMap">
        <ion-toolbar>
          <ion-button @click="cancel()" slot="start">Zurück</ion-button>
          <ion-button @click="confirm()" slot="end">Anwenden</ion-button>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-grid>
          <ion-row>
            <ion-col size="6">
              <ion-item>
                <ion-select aria-label="Range" :value="SelectedRange" @ionChange="handleRangeChange">
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
            <ion-col size="6">
              <ion-item>
                <ion-select aria-label="Fallstatus" placeholder="Fallstatus" :value="SelectedCrimeStatus"
                  @ionChange="handleStatusChange">
                  <ion-select-option value="">Beides</ion-select-option>
                  <ion-select-option value="closed">Gelöst</ion-select-option>
                  <ion-select-option value="open">Ungelöst</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12">
              <ion-item>
                <ion-select aria-label="Fallstatus" placeholder="Fallart" :value="SelectedCrimeType"
                  @ionChange="handleCaseTypeChange">
                  <ion-select-option value="">Alles</ion-select-option>
                  <ion-select-option value="murder">Mord</ion-select-option>
                  <ion-select-option value="theft">Diebstahl</ion-select-option>
                  <ion-select-option value="robbery-murder">Raub mit Mord</ion-select-option>
                  <ion-select-option value="brawl">Schlägerei</ion-select-option>
                  <ion-select-option value="rape">Vergewaltigung</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref } from "vue";
import { GoogleMap } from "@capacitor/google-maps";
import { mapService } from "@/services/map-service";
import { Casetype, Coordinate, ListOfCases, Status } from "@/types/supabase-global";
import { filterOutline, add } from "ionicons/icons";
import {
  IonItem,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonSearchbar,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
  IonFab,
  IonFabButton,
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonPage
} from "@ionic/vue";

const modal = ref();

const cancel = () => {
  modal.value.$el.dismiss(null, 'cancel');
}

const confirm = () => {
  modal.value.$el.dismiss(null, 'cancel');
  filterEvent();
}

const currentLocation = ref<Coordinate>();
let listOfCases: ListOfCases = [];
let SelectedRange = "100";
let SelectedCrimeStatus: Status;
let SelectedCrimeType: Casetype[] = [];
const markerDataLoaded = ref<boolean>(false);
let eventListener: any;
let map: google.maps.Map;

const props = defineProps<{
  markerData: ListOfCases;
}>();

// EVENTS
const emits = defineEmits<{
  (event: "onMarkerClicked", info: any): void;
  (event: "onMapClicked"): void;
  (event: "onMarkerChange", value: ListOfCases): void;
}>();

onMounted(async () => {
  listOfCases = props.markerData;
  currentLocation.value = await mapService.currentLocation();
  console.log(currentLocation.value);
  document.getElementById("map")?.appendChild(mapService.mapDiv);
  mapService.mapDiv.style.height = "93.8%";
  mapService.mapDiv.style.width = "100%";
  const googleMapScript = document.createElement("SCRIPT");
  googleMapScript.setAttribute(
    "src",
    `https://maps.googleapis.com/maps/api/js?key=${mapService.googleAPIKey}&libraries=places,geometry`
  );
  googleMapScript.setAttribute("defer", "");
  googleMapScript.setAttribute("async", "");
  googleMapScript.setAttribute("type", "text/javascript");
  document.head.appendChild(googleMapScript);

  await nextTick();
  Sleep(5000);
  listOfCases.forEach((caseDetails) => {
    createMarker(
      caseDetails.lat,
      caseDetails.long,
      mapService.map,
      caseDetails.title
    );
  });
  createSearchbar();
  showMarkersOnMap(mapService.map);
  markerDataLoaded.value = true;
});

function createMarker(
  lat: number,
  lng: number,
  map: google.maps.Map,
  caseTitle: string
) {
  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map,
    title: caseTitle,
  });

  marker.addListener("click", async () => {
    map?.setCenter(new google.maps.LatLng(lat, lng));
  });
  mapService.markers.push(marker);
}

function showMarkersOnMap(map: google.maps.Map) {
  mapService.markers.forEach((marker) => marker.setMap(map));
}

function deleteMarkers() {
  mapService.markers.forEach((marker) => marker.setMap(null));
  mapService.markers = [];
}

function createSearchbar() {
  const elem = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[0];
  const center = { lat: 50.064192, lng: -130.605469 };
  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  };

  const options = {
    bounds: defaultBounds,
    componentRestrictions: { country: "de" },
    fields: ["geometry", "name"],
    strictBounds: false,
    types: ["establishment"],
  };

  const autocomplete = new google.maps.places.Autocomplete(elem, options);
  eventListener = google.maps.event.addListener(autocomplete, 'place_changed', function () {
    const place = autocomplete.getPlace();
    const location = place['geometry']!['location'];
    const latitude = location?.lat();
    const longitude = location?.lng();
    // Move the map programmatically
  });
};

const getAddress = (place: any) => {
  console.log('Address Object', place);
};

const filterEvent = async () => {
  const range = Number(SelectedRange);
  listOfCases = await mapService.getFilteredCases(currentLocation.value!.latitude, currentLocation.value!.longitude, range, SelectedCrimeStatus, SelectedCrimeType);
  emits('onMarkerChange', listOfCases);
};

const handleRangeChange = async (event: { detail: { value: string } }) => {
  SelectedRange = event.detail.value;
};

const handleStatusChange = async (event: { detail: { value: string } }) => {
  if (event.detail.value === "") {
    SelectedCrimeStatus = null;
  } else {
    SelectedCrimeStatus = event.detail.value as Status;
  }
  console.log(SelectedCrimeStatus);
};

const handleCaseTypeChange = async (event: { detail: { value: string } }) => {
  SelectedCrimeType = [];
  if (event.detail.value === "") {
    SelectedCrimeType.push(null);
  } else {
    const caseType = event.detail.value as Casetype;
    SelectedCrimeType.push(caseType);
  }
  console.log(SelectedCrimeType);
}

function Sleep(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

</script>

<style lang="css" scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
