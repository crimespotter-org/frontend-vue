<template>

  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start" class="ml-4">
        <ion-badge slot="start">{{ props.markerData[0].upvotes }}</ion-badge>

        <ion-button>

          <ion-icon slot="icon-only" :icon="thumbsUpOutline"></ion-icon>
        </ion-button>

        <ion-button>
          <ion-icon slot="icon-only" :icon="thumbsDownOutline"></ion-icon>
        </ion-button>
        <ion-badge slot="start">{{ props.markerData[0].downvotes }}</ion-badge>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="routeToChangeCaseView">
          <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding case" :fullscreen="true">

    <ion-card>
      <ion-card-content>
        Updaten über den Update Button auf der Info Seite!
        <ion-list>
          <ion-item v-for="(link, index) in linkList" :key="index">
            <ion-grid>
              <ion-row>
                <ion-col>
                  <p>Hallo</p>
                </ion-col>
                <ion-col>
                  <a :href=link.linkUrl>{{ link.linkUrl }}</a>
                </ion-col>

              </ion-row>
            </ion-grid>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>


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

      <div class="ion-padding" slot="content">
        <ion-card>
          <Swiper>
            <SwiperSlide v-for="(pic, index) in picture" :key="index">
              <ion-img :src=pic.pictureUri alt="Hier sollte ein Bild sein"></ion-img>
            </SwiperSlide>
          </Swiper>
        </ion-card>
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

          <ion-list>
            <ion-item v-for="(pic, index) of picture" :key="index">
              <ion-thumbnail slot="start">
                <ion-img alt="Hier sollte ein Bild sein" :src=pic.pictureUri />
              </ion-thumbnail>
              <ion-label>{{ pic.imageName }}</ion-label>
            </ion-item>
          </ion-list>


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
import { thumbsUpOutline, thumbsDownOutline, createOutline, alertCircleOutline, checkmarkCircleOutline, locationOutline, calendarOutline, constructOutline } from 'ionicons/icons';
import router from '../router';
import { caseService } from '@/services/case-service';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Case, Status, Casetype, ImageData, Link, LinkType, FilteredCases } from "@/types/supabase-global";
import { StatusBar } from "@capacitor/status-bar";


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
  background: #ffffff00;

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
  background-color: rgb(0, 0, 0);
  padding: 8px 16px;
  border-radius: 100%;
  border: 2px solid black;
  color: #990000;
}

.swiper-button-prev {
  background-color: rgb(0, 0, 0);
  padding: 8px 16px;
  border-radius: 100%;
  border: 2px solid black;
  color: #990000;
}

ion-button {
  --background: #990000;
}

.select-fill-solid {
  --background: rgba(255, 255, 255, 0);
}
</style>
