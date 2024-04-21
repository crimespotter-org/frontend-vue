<template>

  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start" class="ml-4">
        <ion-badge slot="start">{{ upVotes }}</ion-badge>
 
        <ion-button>
          
          <ion-icon slot="icon-only" :icon="thumbsUpOutline"></ion-icon>
        </ion-button>
        
        <ion-button>
          <ion-icon slot="icon-only" :icon="thumbsDownOutline"></ion-icon>
        </ion-button>
        <ion-badge slot="start" >{{ upVotes }}</ion-badge>        
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="routeToChangeCaseView">
          <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding case" :fullscreen="true">
    <div>
      <div class="grid justify-items-center">
        <ion-title size="large" class="font-bold">{{ props.markerData[0].title }}</ion-title>

      </div>
      <div class="flex gap-x-4">
        <ion-icon :icon="locationOutline"></ion-icon>
        <p>{{ props.markerData[0].place_name }}</p>
      </div>
      <div class="flex gap-x-4">
        <ion-icon :icon="iconName"></ion-icon>
        <p>{{ stateOfCaseGerman }}</p>
      </div>
      <div class="flex gap-x-4">
        <ion-icon :icon="calendarOutline"></ion-icon>

        <p> {{ formattedDate }}</p>
      </div>

      <ion-accordion-group class="mt-6">

        <ion-accordion value="first" class="custom-accordion" color="primary">
          <ion-item slot="header" color="light-shade">
            <ion-label>Zusammenfassung</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>{{ props.markerData[0].summary }}</p>
          </div>
        </ion-accordion>

        <ion-accordion value="second" class="custom-accordion">
          <ion-item slot="header" color="light-shade">
            <ion-label>Bilder zu diesem Fall</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content"><ion-card>
              <swiper :navigation="true" :modules="navigation" class="mySwiper" @click="getSlideData">
                <swiper-slide v-for="(uri, index) of pictureUriList" :key="index">
                  <ion-img v-if="uri" :src=uri alt="Hier sollte ein Bild sein"></ion-img>
                </swiper-slide>
              </swiper>
            </ion-card></div>
        </ion-accordion>

        <ion-accordion value="third" class="custom-accordion">
          <ion-item slot="header" color="light-shade">
            <ion-label>Links zu diesem Fall</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">Third Content</div>
        </ion-accordion>

      </ion-accordion-group>


    </div>

  </ion-content>


</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ListOfCases } from "@/types/supabase-global";
import { IonContent, IonHeader, IonTitle, modalController, IonButton, IonToolbar, IonButtons, IonIcon, IonAccordion, IonAccordionGroup, IonItem, IonLabel } from "@ionic/vue";
import { thumbsUpOutline, thumbsDownOutline, createOutline, alertCircleOutline, checkmarkCircleOutline, locationOutline, calendarOutline } from 'ionicons/icons';
import router from '../router';
import { caseService } from '@/services/case-service';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Status } from "@/types/supabase-global";
import { StatusBar } from "@capacitor/status-bar";


const dataLoaded = ref<boolean>(false);
const showComponent = ref<boolean>(false);
const modal = ref();
const isToastOpen = ref(false);

const ionInputTitle = ref();
const ionInputSummary = ref();
const ionInputCrimeDate = ref();
const ionInputCrimeTime = ref();
const navigation = [Navigation];
const isOpen = ref(false);
const pictureUriList: string[] = [];

let iconName = ref("");
let stateOfCaseGerman = ref("");
let stateOfCase: Status;
let SelectedDateTime: string;
let CrimeTime: string;
let CrimeDate: string;
let CaseId: string;
let Latitude: number;
let Longitude: number;
let PlaceName: string;
let ToastMessage: string;
let formattedDate: string;
let upVotes: any;




onMounted(async () => {
  CaseId = props.markerData[0].id;

  const caseImages = await caseService.getCaseImagesFromStorage(CaseId);
  await Promise.all(caseImages!.map(async (file) => {
    const pictureUri = await caseService.getPublicUrl(file.name, CaseId);
    pictureUriList.push(pictureUri);
  }));

  upVotes.value = await caseService.getUpvotes(CaseId);




});

const getSlideData = (event: any) => {
  console.log(event);

  console.log(Swiper.activeIndex);

  isOpen.value = true;

}

// PROPS
const props = defineProps<{
  markerData: ListOfCases;
}>();

const emits = defineEmits<{
  (event: "onDismiss"): void;
}>();

setStatusAndIcon();
modifyDate();

async function setStatusAndIcon() {
  stateOfCase = props.markerData[0].status;

  if (stateOfCase == "closed") {
    stateOfCaseGerman = "Fall geschlossen";
    iconName = checkmarkCircleOutline;
  } else {
    stateOfCaseGerman = "Fall ungelöst";
    iconName = alertCircleOutline;
  }
};

function modifyDate() {
  const crimeDateTime = new Date(props.markerData[0].crime_date_time);
  formattedDate = crimeDateTime.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });

  formattedDate += ' Uhr';
}

async function closeModal() {
  await modalController.dismiss();
};

const routeToChangeCaseView = async () => {
  await modalController.dismiss();
  router.push(`/change-case/${props.markerData[0].id}`);
};
</script>

<style scoped>
.custom-accordion {
  background-color: rgba(255, 255, 255, 0);
  /* Hintergrundfarbe transparent setzen */
  --box-shadow: none;
}

div[slot='content'] {
  background: rgba(var(--ion-color-light-shade), 0.25);
}
</style>
