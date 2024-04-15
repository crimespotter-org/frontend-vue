<template>
    <ion-page v-if="dataLoaded" class="crimeMap">
        <HeaderComponent />
        <ion-content class="ion-padding">
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-card>
                            <swiper :navigation="true" :modules="navigation" class="mySwiper" @click="getSlideData" >
                                <swiper-slide v-for="(uri,index) of pictureUriList" :key="index">
                                    <ion-img v-if="uri" :src=uri alt="Hier sollte ein Bild sein"></ion-img>
                                </swiper-slide>
                            </swiper>
                        </ion-card>
                    </ion-col>
                </ion-row>
                <ion-row class="input-row">
                    <ion-col size="12">
                        <ion-textarea ref="ionInputTitle" label="Title: " :value="detailCase[0].title"></ion-textarea>
                    </ion-col>
                </ion-row>
                <ion-row class="input-row">
                    <ion-col size="6">
                        <ion-item>
                            <ion-select aria-label="Fallstatus"  label="Fallstatus" label-placement="floating" fill="solid" :value="CaseStatus"
                                @ionChange="handleStatusChange">
                                <ion-select-option value="closed">Gelöst</ion-select-option>
                                <ion-select-option value="open">Ungelöst</ion-select-option>
                            </ion-select>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item>
                            <ion-select  label="Straftat" label-placement="floating" fill="solid" aria-label="Straftat" :value="CaseType"
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
                <ion-row class="input-row">
                    <ion-col size="12">
                        <div v-if="showComponent">
                            <ion-searchbar color="tertiary" autocomplete="on" @ion-change="getAddress"
                                @ion-focus="setLocation" :value="PlaceName">
                            </ion-searchbar>
                        </div>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">
                        <ion-fab>
                            <ion-fab-button @click="onCalenderClickEvent" color="secondary">
                                <ion-icon :icon="calendarOutline"></ion-icon>
                            </ion-fab-button>
                        </ion-fab>
                    </ion-col>
                    <ion-col>
                        <ion-input ref="ionInputCrimeDate" :readonly="true" label="Tatdatum: "
                            :value="CrimeDate"></ion-input>
                        <ion-input ref="ionInputCrimeTime" :readonly="true" label="Tatzeit: "
                            :value="CrimeTime"></ion-input>
                    </ion-col>
                </ion-row>
                <ion-row class="input-row">
                    <ion-col size="12">
                        <ion-textarea ref="ionInputSummary" label="Inhalt:" :value="detailCase[0].summary"
                            rows="16"></ion-textarea>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-toast trigger="open-toast" :is-open="isToastOpen" :message=ToastMessage :duration="5000"
                        @didDismiss="setOpen(false)"></ion-toast>
                </ion-row>
            </ion-grid>
            <ion-row>
                <ion-col size="3">
                    <ion-button @click="updateCase">Update</ion-button>
                </ion-col>
                <ion-col size="5">
                </ion-col>
                <ion-col size="4">
                    <ion-button @click="navigateBack">Zurück</ion-button>
                </ion-col>
            </ion-row>
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
            <ion-alert :is-open="isOpen" header="Bild Optionen"
                message="show" :buttons="alertButtons" @didDismiss="isOpen=false">
            </ion-alert>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted } from "vue";
import {
    IonHeader,
    IonToolbar,
    IonTitle,
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
    IonAlert,
    IonCard,
    useIonRouter,
    IonToast,
    IonButtons,

} from '@ionic/vue';
import { caseService } from '@/services/case-service';
import { calendarOutline} from "ionicons/icons";
import { useRoute } from "vue-router";
import { Case, Status, Casetype } from "@/types/supabase-global";
import {Swiper, SwiperSlide} from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import HeaderComponent from '../components/Header.vue';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const ionRouter = useIonRouter();
const dataLoaded = ref<boolean>(false);
const showComponent = ref<boolean>(false);
const modal = ref();
const isToastOpen = ref(false);
const route = useRoute();
const ionInputTitle = ref();
const ionInputSummary = ref();
const ionInputCrimeDate = ref();
const ionInputCrimeTime = ref();
const navigation = [Navigation];
const isOpen = ref(false);
const pictureUriList: string[] = [];

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

const alertButtons = [
    {
      text: 'Bild löschen',
      role: 'delete',
      handler: () => {

      },
    },
    {
      text: 'Kamera verwenden',
      role: 'camera',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
    {
      text: 'Bild hinzufügen',
      role: 'include',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

const cancel = () => {
    modal.value.$el.dismiss(null, 'cancel');
}

const confirm = () => {
    console.log(SelectedDateTime)
    CrimeDate = convertDateString(SelectedDateTime);
    ionInputCrimeDate.value.$el.value = CrimeDate;
    ionInputCrimeTime.value.$el.value = CrimeTime;
    modal.value.$el.dismiss(null, 'cancel');
}

onMounted(async () => {
    CaseId = route.params['caseId'].toString();
    detailCase = await caseService.getCase(CaseId);
    SelectedDateTime = detailCase[0].crime_date_time

    CrimeDate = convertDateString(detailCase[0].crime_date_time);
    CaseType = detailCase[0].case_type;
    CaseStatus = detailCase[0].status;
    Latitude = detailCase[0].lat;
    Longitude = detailCase[0].long;
    PlaceName = detailCase[0].place_name;

    const caseImages = await caseService.getCaseImagesFromStorage(CaseId);
    await Promise.all(caseImages!.map(async (file) => {
    const pictureUri = await caseService.getPublicUrl(file.name, CaseId);
    pictureUriList.push(pictureUri);
    }));

    dataLoaded.value = true;
    showComponent.value = true;
    showComponent.value = false;
    showComponent.value = true;
    setLocation();

    
});

const setLocation = ()=> {

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

const updateCase = async() => {
    const successful = await caseService.updateCase(
        CaseId,
        CaseType,
        "02cb674f-ff36-4e62-aeb7-dfcdf58e0eae",
        SelectedDateTime,
        Latitude,
        Longitude,
        PlaceName,
        CaseStatus,
        ionInputSummary.value.$el.value,
        ionInputTitle.value.$el.value,
        72160
    );

    if(successful){
        ToastMessage = "Case erfolgreich geupdatet!";
        setOpen(true);
    }else{
        ToastMessage = "Etwas lief schief probier es später nochmal!"
        setOpen(true);
    }
    
};

const onCalenderClickEvent = () => {
    modal.value.$el.present();
}

const handleStatusChange = async (event: { detail: { value: string } }) => {
    CaseStatus = event.detail.value as Status;
};

const handleCaseTypeChange = async (event: { detail: { value: string } }) => {
    CaseType = event.detail.value as Casetype;
};

const getAddress = (place: any) => {
    console.log('Address Object', place);
};

const setOpen = (state: boolean) => {
        isToastOpen.value = state;
      };

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

const getSlideData = (event: any) => {
    console.log(event);
    
    console.log(swiper.activeIndex);

    isOpen.value = true;

}

const navigateBack = () => {
    ionRouter.push("/crime-map");
}

</script>

<style scoped>
.input-row {
    margin-bottom: 20px;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-button-next {
    background-color: white;
            padding: 8px 16px;
            border-radius: 100%;
            border: 2px solid black;
            color: #990000;
}

.swiper-button-prev {
    background-color: white;
            padding: 8px 16px;
            border-radius: 100%;
            border: 2px solid black;
            color: #990000;
}

ion-button {
    --background: #990000;
}

.select-fill-solid{
    --background: #2f2f2f;
}

</style>