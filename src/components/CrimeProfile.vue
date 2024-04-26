<template>

  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start" class="ml-4">
        <ion-badge slot="start" ref="votes[0].upvotes"></ion-badge>

        <ion-button @click="updateVote(1)">

          <ion-icon slot="icon-only" :icon="thumbsUpOutline"></ion-icon>
        </ion-button>

        <ion-button @click="updateVote(-1)">
          <ion-icon slot="icon-only" :icon="thumbsDownOutline"></ion-icon>
        </ion-button>    
        <ion-badge slot="start" ref="votes[0].downvotes" ></ion-badge>
      </ion-buttons>
      <ion-buttons slot="end" v-if="isCrimefluencer">
        <ion-button @click="routeToChangeCaseView">
          <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="case ion-padding" :fullscreen="true">

    <div>
      <div class="grid justify-items-center">
        <ion-title size="large" class="font-bold">{{ props.markerData[0].title }}</ion-title>
      </div>

      <div class="flex gap-x-4">
        <ion-icon :icon="locationOutline"></ion-icon>
        <p>{{ props.markerData[0].place_name }}</p>
      </div>
      <div class="flex gap-x-4">
        <ion-icon :icon="calendarOutline"></ion-icon>
        <p> {{ formattedDate }}</p>
      </div>
      <div class="flex gap-x-4">
        <ion-icon :icon="iconName"></ion-icon>
        <p>{{ stateOfCaseGerman }}</p>
      </div>
      <div class="flex gap-x-4">
        <ion-icon :icon="constructOutline"></ion-icon>
        <p>{{ typeOfCaseGerman }}</p>
      </div>


      <Swiper class="custom-delete-white">
        <SwiperSlide v-for="(pic, index) in picture" :key="index" class="custom-delete-white">
          <ion-img :src=pic.pictureUri alt="Hier sollte ein Bild sein" class="custom-delete-white"></ion-img>
        </SwiperSlide>
      </Swiper>


      <ion-accordion-group class="mt-6">

        <ion-accordion value="first" class="custom-transparent" color="primary">
          <ion-item slot="header" color="light-shade">
            <ion-label>Zusammenfassung</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>{{ props.markerData[0].summary }}</p>
          </div>
        </ion-accordion>


        <ion-accordion value="third" class="custom-transparent">
          <ion-item slot="header" color="light-shade">
            <ion-label>Links zu diesem Fall</ion-label>
          </ion-item>
          <div class="ion-padding custom-transparent" slot="content">
            <ion-list class="custom-transparent">
              <div class="grid gap-4 grid-cols-2" v-for="(link, index) in linkList" :key="index">
                <div>
                  <p v-if='link.type == "newspaper"'>📰Zeitung: </p>
                  <p v-if='link.type == "podcast"'>🎧Podcast: </p>
                  <p v-if='link.type == "book"'>📖Buch: </p>
                </div>
                <div><a :href=link.linkUrl>{{ link.linkUrl }}</a></div>
              </div>
            </ion-list>
          </div>
        </ion-accordion>

      </ion-accordion-group>


    </div>
    <ion-toast trigger="open-toast" :is-open="isToastOpen" :message=ToastMessage :duration="5000"
      @didDismiss="setOpen(false)"></ion-toast>

  </ion-content>


</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ListOfCases } from "@/types/supabase-global";
import { IonContent, IonHeader, IonTitle, modalController, IonButton, IonToolbar, IonButtons, IonIcon, IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonToast } from "@ionic/vue";
import { thumbsUpOutline, thumbsDownOutline, createOutline, alertCircleOutline, checkmarkCircleOutline, locationOutline, calendarOutline, constructOutline, newspaper } from 'ionicons/icons';
import router from '../router';
import { caseService } from '@/services/case-service';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Case, Status, Casetype, ImageData, Link, LinkType, FilteredCases, Role, CaseVote } from "@/types/supabase-global";
import { currentUserInformation } from '@/services/currentUserInformation-service';


//import { SwiperCore, Virtual } from "swiper";
import "swiper/swiper-bundle.css";


//Emma
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
let picture = ref<ImageData[]>([]);
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
const navigation = [Navigation];
const isOpen = ref(false);
const pictureUriList: string[] = [];

let iconName = ref("");
let stateOfCaseGerman = ref("");
let stateOfCase: Status;
let formattedDate: string;
let upVotes: any[] | null;
let typeOfCase: Casetype;
let typeOfCaseGerman = ref("");
let typeOfLink: LinkType;
let typeOfLinkGerman = ref("");
let changeNotSuccesful = ref(false);
let changemessage = ref("");
const isAdmin = ref(false);
const isCrimefluencer = ref(false);
let votes = ref<CaseVote>([]);




onMounted(async () => {
  CaseId = props.markerData[0].id;

  const caseImages = await caseService.getCaseImagesFromStorage(CaseId);
  await Promise.all(caseImages!.map(async (file) => {
    const pictureUri = await caseService.getPublicUrl(file.name, CaseId);
    let imageData: ImageData = {
      pictureUri: pictureUri,
      imageName: file.name
    };
    picture.value.push(imageData);
  }));


  votes.value = await caseService.getVotes(CaseId);

  detailCase = await caseService.getCase(CaseId);
  detailCase.forEach(function (item) {
    let link: Link = {
      linkId: item.link_id,
      type: item.link_type,
      linkUrl: item.url
    };
    linkList.value.push(link);
  });


  pictureLoaded.value = true;




});

const getSlideData = (event: any) => {
  console.log(event);

  console.log(Swiper.activeIndex);

  isOpen.value = true;

}

// PROPS
const props = defineProps<{
  markerData: FilteredCases;
}>();

const emits = defineEmits<{
  (event: "onDismiss"): void;
}>();
const getPicture = () => {

};

setStatusAndIcon();
modifyDate();
setCaseType();
getCurrentUserRoleFromService();

async function updateVote(vote: number) {
  const voteSuccesful = await caseService.updateVote(props.markerData[0].id, vote);
  votes.value = await caseService.getVotes(CaseId);
  if (voteSuccesful) {
    ToastMessage = "Das Voting war erfolgreich.";
    setOpen(true);    
  } else if (!voteSuccesful) {

    ToastMessage = "Das Voting war nicht erfolgreich. Bitte versuchen Sie es erneut.";
    setOpen(true);
  }
}


const setOpen = (state: boolean) => {
  isToastOpen.value = state;
};




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

async function setCaseType() {
  typeOfCase = props.markerData[0].case_type;

  if (typeOfCase == "murder") {
    typeOfCaseGerman = "Mord";
  } else if (typeOfCase == "theft") {
    typeOfCaseGerman = "Diebstahl";
  } else if (typeOfCase == "robbery-murder") {
    typeOfCaseGerman = "Raub mit Mord";
  } else if (typeOfCase == "brawl") {
    typeOfCaseGerman = "Schlägerei";
  } else if (typeOfCase == "rape") {
    typeOfCaseGerman = "Vergewaltigung";
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

const routeToChangeCaseView = async () => {
  await modalController.dismiss();
  router.push(`/change-case/${props.markerData[0].id}`);
};
</script>

<style scoped>
.custom-transparent {
  background-color: rgba(255, 255, 255, 0);
  /* Hintergrundfarbe transparent setzen */
  --box-shadow: none;
}

.custom-delete-white {
  padding: 0;
  /* Padding entfernen */
  margin: 0;
  background-color: rgba(0, 0, 0, 0);
}
</style>
