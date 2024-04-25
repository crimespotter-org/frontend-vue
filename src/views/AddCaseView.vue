<template>
    <ion-page>
        <HeaderComponent />

        <ion-content class="ion-padding case">
            <ion-title>
                Fall hinzufügen
            </ion-title>
            
            <ion-list class="custom">
                <!-- Titel -->
                <ion-item class="custom">
                    <ion-input v-model="caseData.title" label="Titel" label-placement="floating"
                        :auto-grow="true"></ion-input>
                </ion-item>

                <!-- Zusammenfassung -->
                <ion-item>
                    <ion-textarea v-model="caseData.summary" label="Zusammenfassung" label-placement="floating"
                        :auto-grow="true"></ion-textarea>
                </ion-item>

                <!-- Location (Dropdown) -->
                <ion-item>
                    <ion-searchbar class="custom" autocomplete="on" @ion-focus="setLocation" show-clear-button="always"
                        :clear-icon="trashOutline" value="Tatort"></ion-searchbar>

                </ion-item>

                <!-- Status (Dropdown) -->
                <ion-item>
                    <ion-select aria-label="Fallstatus" label="Fallstatus" label-placement="floating"
                        v-model="caseData.status">
                        <ion-select-option value="closed">Gelöst</ion-select-option>
                        <ion-select-option value="open">Ungelöst</ion-select-option>
                    </ion-select>
                </ion-item>

                <!-- Typ (Dropdown) -->
                <ion-item>
                    <ion-select label="Straftat" label-placement="floating" aria-label="Straftat"
                        v-model="caseData.type">
                        <ion-select-option value="murder">Mord</ion-select-option>
                        <ion-select-option value="theft">Diebstahl</ion-select-option>
                        <ion-select-option value="robbery-murder">Raub mit Mord</ion-select-option>
                        <ion-select-option value="brawl">Schlägerei</ion-select-option>
                        <ion-select-option value="rape">Vergewaltigung</ion-select-option>
                    </ion-select>
                </ion-item>

                <!-- Tatzeitpunkt (Kalender) -->
                <ion-item>
                    <ion-grid>
                        <ion-row>
                            <ion-col size="3" class="my-auto mx-2">
                                <ion-fab-button @click="onCalenderClickEvent" color="secondary">
                                    <ion-icon :icon="calendarOutline"></ion-icon>
                                </ion-fab-button>
                            </ion-col>
                            <ion-col>
                                <ion-input ref="ionInputCrimeDate" label="Tatdatum: " :value="CrimeDate"></ion-input>
                                <ion-input ref="ionInputCrimeTime" label="Tatzeit: " :value="CrimeTime"></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-item>


                <!-- Kamera-Symbol/Bilder hochladen -->
                <!-- Hier kannst du eine Komponente für das Hochladen von Bildern einfügen -->

                <!-- Links hinzufügen -->
                <!-- Hier kannst du eine Komponente für das Hinzufügen von Links einfügen -->
            </ion-list>
            <ion-modal ref="modal" :initial-breakpoint="0.75">
                <ion-header>
                    <ion-toolbar>
                        <ion-button @click="cancel()" slot="start">Zurück</ion-button>
                        <ion-button @click="confirm()" slot="end">Anwenden</ion-button>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-datetime display-format="YYYY-MM-DDTHH:mm:ssTZD" v-model="SelectedDateTime"></ion-datetime>
                </ion-content>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonPage,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonFab,
    IonFabButton,
    IonIcon,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonSearchbar,
    IonImg,
    IonCard,
    useIonRouter,
    IonToast,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonCardContent,
    IonThumbnail,

} from '@ionic/vue';
import { ref, onMounted } from "vue";
import HeaderComponent from '../components/Header.vue';
import { Case, Status, Casetype, ImageData, Link, LinkType } from "@/types/supabase-global";
import { calendarOutline, cameraOutline, imageOutline, trashOutline, arrowUpOutline, micOutline, newspaperOutline, bookOutline } from "ionicons/icons";


//Emma
const ionRouter = useIonRouter();
const dataLoaded = ref<boolean>(false);
const pictureLoaded = ref<boolean>(false);
const showComponent = ref<boolean>(false);
const modal = ref();
const isToastOpen = ref(false);

const ionInputTitle = ref();
const ionInputSummary = ref();
const ionInputCrimeDate = ref();
const ionInputCrimeTime = ref();
const linkInputUrl = ref();
const segment = ref('info');

let linkListUpdate = ref();
let picture: ImageData[] = [];
const linkList = ref<Link[]>([]);
let detailCase: Case;
let SelectedDateTime: string;
let CaseType: Casetype;
let CaseStatus: Status;
let CrimeTime: string;
let CrimeDate: string;
let CaseId: string;
let Latitude: number;
let Longitude: number;
let PlaceName: string;
let ToastMessage: string;
let linkTyp: LinkType = "newspaper";

//Nina
let caseData = {
    title: '',
    summary: '',
    location: '',
    status: '',
    type: '',
    dateTime: '',
    // Weitere Felder hier hinzufügen
};

const cancel = () => {
    modal.value.$el.dismiss(null, 'cancel');
}

const onCalenderClickEvent = () => {
    modal.value.$el.present();
};

const confirm = () => {
    console.log(SelectedDateTime)
    CrimeDate = convertDateString(SelectedDateTime);
    ionInputCrimeDate.value.$el.value = CrimeDate;
    ionInputCrimeTime.value.$el.value = CrimeTime;
    modal.value.$el.dismiss(null, 'cancel');
}
function convertDateString(inputDate: string): string {
    const date = new Date(inputDate);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    CrimeTime = `${hours}:${minutes}:${seconds}`;
    return `${day}.${month}.${year}`;
}

const setLocation = () => {

    const elem = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[1];
    console.log(elem);
    elem.autocomplete = 'on';

    const autocomplete = new google.maps.places.Autocomplete(elem);
    const returnFields = ["geometry", "name"];
    autocomplete.setFields(returnFields);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        const place = autocomplete.getPlace();
        const location = place['geometry']!['location'];
        Latitude = location!.lat();
        Longitude = location!.lng();
        PlaceName = place.name!;
    });
};

const getAddress = (place: any) => {
    console.log('Address Object', place);
};
</script>

<style scoped>
.input-row {
    margin-bottom: 20px;
}

ion-button {
    --background: #990000;
}

.select-fill-solid {
    --background: white;
}

ion-content {
    --background: transparent: !important;
}


ion-searchbar.custom {
    --background: #19422d00;
    --color: #000000;
    --placeholder-color: #000000;
    --icon-color: #000000;
    --clear-button-color: #000000;
    --box-shadow: none;
    --border-radius: 4px;
}

.custom {
    --background: transparent:  !important;
}

ion-searchbar.ios.custom {
    --cancel-button-color: #000000;
}

ion-searchbar.md.custom {
    --cancel-button-color: #000000;
}
</style>