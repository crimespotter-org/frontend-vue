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
    <capacitor-google-map ref="mapRef" style="display: inline-block; width: 100vw; height: 86vh">
    </capacitor-google-map>
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
                <ion-select aria-label="Fallstatus" placeholder="Fallstatus" :value="SelectedCrimeStatus"  @ionChange="handleStatusChange">
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
                <ion-select aria-label="Fallstatus" placeholder="Fallart" :value="SelectedCrimeType"  @ionChange="handleCaseTypeChange">
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
import { onMounted, nextTick, ref, onUnmounted } from "vue";
import { GoogleMap } from "@capacitor/google-maps";
import { mapService } from "@/services/map-service";
import { Casetype, Coordinate, ListOfCases, Status } from "@/types/supabase-global";
import { filterOutline, add} from "ionicons/icons";
import{
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

const cancel = () =>{
  modal.value.$el.dismiss(null, 'cancel');
} 

const confirm = () =>{
  modal.value.$el.dismiss(null, 'cancel');
  filterEvent();
}

const mapRef = ref<HTMLElement>();
const markerIds = ref<string[] | undefined>();
//const googleApiKey = "AIzaSyCJbAjIZqv32gJ4BeiuomscFObUAUGe-AM";
let newMap: GoogleMap;
const currentLocation = ref<Coordinate>();
let listOfCases: ListOfCases = [];
let SelectedRange = "100";
let SelectedCrimeStatus: Status;
let SelectedCrimeType: Casetype[] = [];
const markerDataLoaded = ref<boolean>(false);
let eventListener: any;

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
  console.log("mounted ", mapRef.value);
  listOfCases = props.markerData;
  console.log(listOfCases);
  await nextTick();
  await createMap();
  markerDataLoaded.value = true;
});

// remove markers on unmount
onUnmounted(async() => {
  console.log("onunmounted");
  newMap.removeMarkers(markerIds?.value as string[]);
  await google.maps.event.removeListener(eventListener);
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
  eventListener = google.maps.event.addListener(autocomplete, 'place_changed', function() {
    const place = autocomplete.getPlace();
    const location = place['geometry']!['location'];
    const latitude = location?.lat();
    const longitude = location?.lng();
    // Move the map programmatically
    newMap.setCamera({
      coordinate: {
        lat: latitude!,
        lng: longitude!
      }
    });
  });
};

const getAddress = (place: any) => {       
  console.log('Address Object', place);
};

const filterEvent = async() =>{
  const range = Number(SelectedRange);
  listOfCases = await mapService.getFilteredCases(currentLocation.value!.latitude, currentLocation.value!.longitude, range, SelectedCrimeStatus, SelectedCrimeType);
  await addSomeMarkers(newMap);
  emits('onMarkerChange', listOfCases);
};

const handleRangeChange = async(event: {detail: {value: string}}) => {
  SelectedRange = event.detail.value;
};

const handleStatusChange = async(event:{detail: {value: string}}) => {
  if(event.detail.value === ""){
    SelectedCrimeStatus = null;
  }else{
    SelectedCrimeStatus = event.detail.value as Status;
  }
  console.log(SelectedCrimeStatus);
};

const handleCaseTypeChange = async(event:{detail:{value:string}}) =>{
  SelectedCrimeType = [];
  if(event.detail.value === ""){
    SelectedCrimeType.push(null);
  }else{
    const caseType = event.detail.value as Casetype;
    SelectedCrimeType.push(caseType);
  }
  console.log(SelectedCrimeType);
}

</script>
