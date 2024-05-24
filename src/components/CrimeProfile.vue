<template>
  <ion-header color="primary">
    <ion-toolbar color="primary">
      <ion-buttons slot="start">
        <ion-button @click="dismiss()">
          <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="start" class="ml-4">

        <ion-badge color="secondary" slot="start" ref="upvote.value">{{ upvote?.toString() }}</ion-badge>

        <ion-button @click="updateVote(1)">

          <ion-icon slot="icon-only" :icon="thumbsUpOutline"></ion-icon>
        </ion-button>

        <ion-button @click="updateVote(-1)">
          <ion-icon slot="icon-only" :icon="thumbsDownOutline"></ion-icon>
        </ion-button>
        <ion-badge color="secondary" slot="start" ref="downvotes.value">{{ downvote?.toString() }}</ion-badge>
      </ion-buttons>
      <ion-buttons slot="end" v-if="isCrimefluencer">
        <ion-button @click="routeToChangeCaseView">
          <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
        </ion-button>
        <ion-button id="present-alert">
          <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
        </ion-button>
        <ion-alert trigger="present-alert" header="Möchtest du den Fall wirklich löschen?" :buttons="alertButtons"
          @didDismiss="alertResult($event)">
        </ion-alert>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content v-if="!dataLoaded">
            <div class="grid content-center justify-center min-h-full">
                <ion-spinner></ion-spinner>
            </div>
        </ion-content>
  <ion-content class="case ion-padding" :fullscreen="true" :scroll-events="true" v-if="dataLoaded">
    <ion-toolbar class="customTransparent">
      <ion-segment v-model="segment" color="primary">
        <ion-segment-button value="info">
          <ion-label>Info</ion-label>
        </ion-segment-button>
        <ion-segment-button value="chat">
          <ion-label>Kommentare</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>
    <div v-show="segment === 'info'">
      <div class="grid justify-items-center text-wrap my-4">
        <h1 class="font-bold text-lg">{{ props.markerData[0].title }}</h1>
      </div>
      <div class="flex gap-x-4">
        <ion-icon :icon="locationOutline"></ion-icon>
        <p>{{ props.markerData[0].place_name }}</p>
      </div>
      <div class="flex gap-x-4">
        <ion-icon :icon="calendarOutline"></ion-icon>
        <p> {{ CrimeDate }}</p>
        <p> {{ CrimeTime }}</p>
      </div>
      <div class="flex gap-x-4">
        <ion-icon :icon="iconName"></ion-icon>
        <p>{{ stateOfCaseGerman }}</p>
      </div>
      <div class="flex gap-x-4">
        <ion-icon :icon="constructOutline"></ion-icon>
        <p>{{ typeOfCaseGerman }}</p>
      </div>

      <ion-card>
        <swiper :navigation="true" :modules="navigation" class="mySwiper">
          <swiper-slide v-for="(pic, index) in picture" :key="index" class="custom-delete-white">
            <ion-img :src=pic.pictureUri alt="Hier sollte ein Bild sein" class="custom-delete-white"></ion-img>
          </swiper-slide>
        </swiper>
      </ion-card>

      <ion-accordion-group class="mt-6">

        <ion-accordion value="first" class="custom-transparent" color="primary">
          <ion-item slot="header" color="light-shade">
            <ion-label color="dark">Zusammenfassung</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>{{ props.markerData[0].summary }}</p>
          </div>
        </ion-accordion>


        <ion-accordion value="third" class="custom-transparent">
          <ion-item slot="header" color="light-shade">
            <ion-label color="dark">Links zu diesem Fall</ion-label>
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
    <div v-show="segment === 'chat'">

      <ion-card class="customTransparent flex px-4 mb-4 border border-gray-400 bg-slay-200 rounded text-black">

        <ion-input ref="newMessage" placeholder="Neuen Kommentar eingeben"></ion-input>
        <ion-button @click="insertMessage" fill="clear">
          <ion-icon slot="icon-only" :icon="arrowForwardOutline"></ion-icon>
        </ion-button>

      </ion-card>

      <ion-card class="customTransparent ">

        <ion-item class="customTransparent" v-for="(comment, index) in messages" :key="index">
          <ion-label>{{ comment.username }}</ion-label>
          <ion-text>{{ comment.text }}</ion-text>
        </ion-item>

      </ion-card>
    </div>
    <ion-toast trigger="open-toast" :is-open="isToastOpen" :message=ToastMessage :duration="5000"
      @didDismiss="setOpen(false)"></ion-toast>
  </ion-content>
  <FooterComponent v-if="dataLoaded" />

</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {
  IonContent,
  IonHeader,
  modalController,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonToast,
  IonCard,
  IonImg,
  IonBadge,
  IonList,
  IonAlert,
  IonButton,
  IonText,
  IonInput,
  IonSegment,
  IonSegmentButton,
  onIonViewDidEnter,
  IonSpinner,
  useIonRouter,
} from "@ionic/vue";
import { thumbsUpOutline, thumbsDownOutline, createOutline, alertCircleOutline, checkmarkCircleOutline, locationOutline, calendarOutline, constructOutline, arrowBackOutline, trashOutline, arrowForwardOutline } from 'ionicons/icons';
import router from '../router';
import { caseService } from '@/services/case-service';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Case, Status, Casetype, ImageData, Link, FilteredCases, Role, CaseVote, Comment } from "@/types/supabase-global";
import { supabase } from "../services/supabase-service";
import { currentUserInformation } from '@/services/currentUserInformation-service';
import "swiper/swiper-bundle.css";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import FooterComponent from '../components/Footer.vue';

const isToastOpen = ref(false);
const picture = ref<ImageData[]>([]);
const linkList = ref<Link[]>([]);
let detailCase: Case;
let CaseId: string;
let ToastMessage: string;
let UserId: string;
const segment = ref('info');
const messages = ref<Comment>([]);
const newMessage = ref();
const dataLoaded = ref<boolean>(false);
const iconName = ref("");
const stateOfCaseGerman = ref("");
let stateOfCase: Status;
let CrimeTime: string;
let CrimeDate: string;
let typeOfCase: Casetype;
const typeOfCaseGerman = ref("");
const isAdmin = ref(false);
const isCrimefluencer = ref(false);
const votes = ref<CaseVote>([]);
const navigation = [Navigation];
const upvote = ref<number>();
const downvote = ref<number>();
const ionRouter = useIonRouter();

const alertButtons = [
  {
    text: 'Zurück',
    role: 'cancel',
    handler: () => {
      console.log('Alert canceled');
    },
  },
  {
    text: 'Löschen',
    role: 'delete',
    handler: () => {
      console.log('Alert confirmed');
    },
  },
];

const alertResult = (ev: CustomEvent) => {
  if (`${ev.detail.role}` == "delete") {
    deleteCase();
  }
};

onIonViewDidEnter(async () => {

  dataLoaded.value = false;
  picture.value = [];
  detailCase = [];
  linkList.value = [];

  CaseId = props.markerData[0].id;
  UserId = (await currentUserInformation.getCurrentUser()).data.session!.user.id;
  const caseImages = await caseService.getCaseImagesFromStorage(CaseId);
  await Promise.all(caseImages!.map(async (file) => {
    const pictureUri = await caseService.getPublicUrl(file.name, CaseId);
    const imageData: ImageData = {
      pictureUri: pictureUri,
      imageName: file.name
    };
    picture.value.push(imageData);
  }));

  votes.value = await caseService.getVotes(CaseId);
  upvote.value = votes.value[0].upvotes;
  downvote.value = votes.value[0].downvotes;

  splitDateTime(props.markerData[0].crime_date_time);

  detailCase = await caseService.getCase(CaseId);
  detailCase.forEach(function (item) {
    const link: Link = {
      linkId: item.link_id,
      type: item.link_type,
      linkUrl: item.url
    };
    linkList.value.push(link);
  });

  messages.value = await caseService.getComments(CaseId);
  dataLoaded.value = true;
})

onMounted(async () => {
  CaseId = props.markerData[0].id;
  UserId = (await currentUserInformation.getCurrentUser()).data.session!.user.id;
  const caseImages = await caseService.getCaseImagesFromStorage(CaseId);
  await Promise.all(caseImages!.map(async (file) => {
    const pictureUri = await caseService.getPublicUrl(file.name, CaseId);
    const imageData: ImageData = {
      pictureUri: pictureUri,
      imageName: file.name
    };
    picture.value.push(imageData);
  }));

  votes.value = await caseService.getVotes(CaseId);
  upvote.value = votes.value[0].upvotes;
  downvote.value = votes.value[0].downvotes;

  splitDateTime(props.markerData[0].crime_date_time);

  detailCase = await caseService.getCase(CaseId);
  detailCase.forEach(function (item) {
    const link: Link = {
      linkId: item.link_id,
      type: item.link_type,
      linkUrl: item.url
    };
    linkList.value.push(link);
  });

  messages.value = await caseService.getComments(CaseId);
  await listenToChanges(CaseId);
  dataLoaded.value = true;
});

// PROPS
const props = defineProps<{
  markerData: FilteredCases;
  modal: any;
}>();

// EVENTS
const emits = defineEmits<{
  (event: "deleteMarker", value: FilteredCases): void;
}>();

function splitDateTime(dateTimeString: string): void {
  const [date, timeWithOffset] = dateTimeString.split('T');
  const [time] = timeWithOffset.split(/[+-]/); // berücksichtigt auch Zeitzonen-Offset
  CrimeDate = date;
  CrimeTime = time;
  console.log(CrimeDate);
}

const dismiss = () => {
  props.modal.$el.dismiss();
};

setStatusAndIcon();
setCaseType();
getCurrentUserRoleFromService();

async function updateVote(vote: number) {
  const voteSuccesful = await caseService.updateVote(props.markerData[0].id, UserId, vote);
  votes.value = await caseService.getVotes(CaseId);
  upvote.value = votes.value[0].upvotes;
  downvote.value = votes.value[0].downvotes;
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
    stateOfCaseGerman.value = "Fall geschlossen";
    iconName.value = checkmarkCircleOutline;
  } else {
    stateOfCaseGerman.value = "Fall ungelöst";
    iconName.value = alertCircleOutline;
  }
}

const insertMessage = async () => {
  const succesful = await caseService.insertComment(CaseId, newMessage.value.$el.value, UserId);
  if (!succesful) {
    ToastMessage = "Irgendwas lief schlief probiere es erneut!";
    setOpen(true);
  } else {
    newMessage.value.$el.value = "";
  }
}

async function setCaseType() {
  typeOfCase = props.markerData[0].case_type;

  if (typeOfCase == "murder") {
    typeOfCaseGerman.value = "Mord";
  } else if (typeOfCase == "theft") {
    typeOfCaseGerman.value = "Diebstahl";
  } else if (typeOfCase == "robbery-murder") {
    typeOfCaseGerman.value = "Raub mit Mord";
  } else if (typeOfCase == "brawl") {
    typeOfCaseGerman.value = "Schlägerei";
  } else if (typeOfCase == "rape") {
    typeOfCaseGerman.value = "Vergewaltigung";
  }
}


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

const deleteCase = async () => {
  await caseService.deleteCase(CaseId);
  emits('deleteMarker', props.markerData);
  props.modal.$el.dismiss();
  ionRouter.push("/crime-map");
}

const listenToChanges = async (caseId: string) => {

  const handleInserts = async (payload: any) => {
    console.log("Change received!", payload);
    const newComment = payload.new;
    const username = await currentUserInformation.getUserName(UserId);
    console.log(username);
    newComment.username = username;
    messages.value.push(newComment);
  };

  // Listen to inserts
  supabase
    .channel(`comments:case_id=eq.${caseId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "comments" },
      handleInserts
    )
    .subscribe();
}
</script>

<style scoped>


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

.custom-delete-white {
  padding: 0;
  /* Padding entfernen */
  margin: 0;
  background-color: rgba(0, 0, 0, 0);
}

.input-button-wrapper {
  display: flex;
  align-items: center;
}

.input-button-wrapper ion-input {
  flex: 1;
  /* Füllt den verfügbaren Platz aus */
  margin-right: 8px;
  /* Ändere dies entsprechend deinem Design */
}
</style>
