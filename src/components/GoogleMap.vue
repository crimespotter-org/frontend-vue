<template>
  <ion-page class="crimeMap">
    <ion-fab slot="fixed" vertical="bottom" horizontal="start" v-if="isCrimefluencer">
      <router-link to="/create-case">
        <ion-fab-button color="secondary">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </router-link>
    </ion-fab>
    <ion-toolbar color="primary" class="flex flex-row justify-between px-4 py-2">
      <div class="flex justify-between">
        <ion-button id="open-modal" color="secondary" slot="start" class="custom-button">
          <ion-icon :icon="filterOutline"></ion-icon>
        </ion-button>
        <ion-searchbar color="tertiary" autocomplete="on" autocapitalize="off"></ion-searchbar>
      </div>
    </ion-toolbar>
    <div class="map" ref="mapDivRef">
    </div>
    <ion-modal ref="modal" trigger="open-modal" class="crimeMap" :initial-breakpoint="0.50">
      <ion-header>
        <ion-toolbar color="primary" class="px-4">
          <ion-button @click="cancel()" slot="start" color="secondary">Zurück</ion-button>
          <ion-button @click="confirm()" slot="end" color="secondary">Anwenden</ion-button>
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
                <ion-select aria-label="Fallstatus" placeholder="Fallart" :value="SelectedCrimeType" :multiple="true"
                  @ionChange="handleCaseTypeChange">
                  <ion-select-option value="murder">Mord</ion-select-option>
                  <ion-select-option value="theft">Diebstahl</ion-select-option>
                  <ion-select-option value="robbery-murder">Raub mit Mord</ion-select-option>
                  <ion-select-option value="brawl">Schlägerei</ion-select-option>
                  <ion-select-option value="rape">Vergewaltigung</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="ml-4 mt-2">
              <ion-toggle color="secondary" @ion-change="toggled" :checked="toggle">Heatmap</ion-toggle>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, onBeforeMount } from "vue";
import { mapService } from "@/services/map-service";
import { Casetype, Coordinate, Status, FilteredCases, Role } from "@/types/supabase-global";
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
  IonPage,
  IonToggle
} from "@ionic/vue";
import { caseService } from "@/services/case-service";
import { currentUserInformation } from '@/services/currentUserInformation-service';

const isAdmin = ref(false);
const isCrimefluencer = ref(false);

getCurrentUserRoleFromService();

async function getCurrentUserRoleFromService() {
    const currentUserRole: Role = await currentUserInformation.getCurrentUserRole();
    checkRole(currentUserRole);
}

function checkRole(currentUserRole: Role) {
    if (currentUserRole == "admin") {
        isAdmin.value = true;
        isCrimefluencer.value = true;
    }
    else if (currentUserRole == "crimefluencer") {
        isCrimefluencer.value = true;
    }
}

const modal = ref();

const cancel = () => {
  modal.value.$el.dismiss(null, 'cancel');
}

const confirm = () => {
  modal.value.$el.dismiss(null, 'cancel');
  filterEvent();
}

const currentLocation = ref<Coordinate>();
let listOfCases: FilteredCases = [];
let SelectedRange = "100";
let SelectedCrimeStatus: Status | null = null;
let SelectedCrimeType: Casetype[] | null = null;
const markerDataLoaded = ref<boolean>(false);
const googleAPIKey = "AIzaSyCJbAjIZqv32gJ4BeiuomscFObUAUGe-AM";
let eventListener: any;
let Latitude: number;
let Longitude: number;
let heatmap: google.maps.visualization.HeatmapLayer;
const toggle = ref<boolean>(false);

//google map object
const map = ref<google.maps.Map>();
const mapDivRef = ref();
let currentMarkers: google.maps.Marker[] = [];


const props = defineProps<{
  markerData: FilteredCases;
}>();

// EVENTS
const emits = defineEmits<{
  (event: "onMarkerClicked", info: Coordinate): void;
  (event: "onMapClicked"): void;
  (event: "onMarkerChange", value: FilteredCases): void;
}>();

onBeforeMount(() => {
  const googleMapScript = document.createElement("SCRIPT");
  googleMapScript.setAttribute(
    "src",
    `https://maps.googleapis.com/maps/api/js?key=${googleAPIKey}&libraries=geometry,places,marker,visualization&callback=initMap`
  );
  googleMapScript.setAttribute("defer", "");
  googleMapScript.setAttribute("async", "");
  document.head.appendChild(googleMapScript);
});

window.initMap = async () => {
  listOfCases = props.markerData;
  currentLocation.value = await mapService.currentLocation();
  console.log(currentLocation);
  map.value = new window.google.maps.Map(mapDivRef.value, {
    zoom: 10,
    disableDefaultUI: false,
    center: { lat: currentLocation.value!.latitude, lng: currentLocation.value!.longitude }
  });
  Sleep(5000);
  loadMapMarkers();
}

onMounted(async () => {
  const vote = await caseService.getVotes("713af3b1-16cf-4a44-893d-5280f1fbfbd9");
  console.log(vote);
  currentLocation.value = await mapService.currentLocation();
  await nextTick();
  Sleep(5000);
  createSearchbar();
  markerDataLoaded.value = true;
});

const loadMapMarkers = () => {
  deleteMarkers();

  const locationMarker = new google.maps.Marker({
    position: { lat: currentLocation.value!.latitude, lng: currentLocation.value!.longitude },
    label: "Home",
    map: map.value,
    title: "Mein Standort"
  });
  currentMarkers.push(locationMarker);

  listOfCases.forEach(markerInfo => {
    const mapMarker = new window.google.maps.Marker({
      position: new window.google.maps.LatLng(markerInfo.lat, markerInfo.long),
      map: map.value,
      title: markerInfo.title
    });

    let coordinate: Coordinate = {
      latitude: markerInfo.lat,
      longitude: markerInfo.long
    };

    mapMarker.addListener('click', () => {
      emits('onMarkerClicked', coordinate);
    })

    currentMarkers.push(mapMarker);
  })

};

function deleteMarkers() {
  currentMarkers.forEach(m => { m.setMap(null) });
  currentMarkers = [];
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
    Latitude = location!.lat();
    Longitude = location!.lng();
    const latlong = new google.maps.LatLng(Latitude, Longitude);
    map.value!.setCenter(latlong);
    map.value!.setZoom(16);
  });
};

const setHeatMap = () => {
  let heatMapData: google.maps.LatLng[] = [];
  listOfCases.forEach(markerInfo => {
    const latLong = new google.maps.LatLng(markerInfo.lat, markerInfo.long);
    heatMapData.push(latLong);
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatMapData
  });

  heatmap.setMap(map.value!);

}

const filterEvent = async () => {
  const range = Number(SelectedRange);
  console.log(SelectedCrimeType);
  console.log(SelectedCrimeStatus);
  listOfCases = await mapService.getFilteredCases(currentLocation.value!.latitude, currentLocation.value!.longitude, range, SelectedCrimeStatus, SelectedCrimeType);
  loadMapMarkers();
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
  if (event.detail.value.length === 0) {
    SelectedCrimeType = null;
  } else {
    const caseType = event.detail.value as Casetype;
    SelectedCrimeType.push(caseType);
  }
  console.log(SelectedCrimeType);
}

const toggled = () => {
  if (toggle.value) {
    toggle.value = false;
    deleteHeatMap();
  } else {
    toggle.value = true;
    setHeatMap();
  }
}

const deleteHeatMap = () => {
  console.log("remove Heatmap");
  heatmap.setData([]);
  heatmap.setMap(null);
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

ion-header {
  --background: #2f2f2f:;
}

.toolbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.custom-button {
  width: 50px;
  /* Hier kannst du die Breite des Buttons nach Bedarf anpassen */
  height: 50px;
  /* Hier kannst du die Höhe des Buttons nach Bedarf anpassen */
}
</style>
