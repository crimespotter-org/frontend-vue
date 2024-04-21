<template>
<<<<<<< HEAD
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button>
          <ion-icon slot="icon-only" :icon="thumbsUpOutline"></ion-icon>
        </ion-button>
        <ion-button>
          <ion-icon slot="icon-only" :icon="thumbsDownOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button>
          <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding case">
    <ion-title size="large" class="font-bold">{{ props.markerData[0].title }}</ion-title>
    <p>{{ props.markerData[0].summary }}</p>
    <p>{{ props.markerData[0].status }}</p>

    <ion-accordion-group>
    <ion-accordion value="first">
      <ion-item slot="header" color="light">
        <ion-label>First Accordion</ion-label>
      </ion-item>
      <div class="ion-padding" slot="content">First Content</div>
    </ion-accordion>
    <ion-accordion value="second">
      <ion-item slot="header" color="light">
        <ion-label>Second Accordion</ion-label>
      </ion-item>
      <div class="ion-padding" slot="content">Second Content</div>
    </ion-accordion>
    <ion-accordion value="third">
      <ion-item slot="header" color="light">
        <ion-label>Third Accordion</ion-label>
      </ion-item>
      <div class="ion-padding" slot="content">Third Content</div>
    </ion-accordion>
  </ion-accordion-group>
  </ion-content>

  
=======
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{props.markerData[0].title}}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal()"><ion-icon name="close-outline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button @click="routeToChangeCaseView">Case bearbeiten</ion-button>
      <p>{{props.markerData[0].title}}</p>
      <p>{{props.markerData[0].summary}}</p>
      <p>{{props.markerData[0].status}}</p>
    </ion-content>
  </ion-page>
>>>>>>> ec9496c53380837d3ee0c17ff6e01128a17c7167
</template>

<script lang="ts" setup>
import { ListOfCases } from "@/types/supabase-global";
<<<<<<< HEAD
import { IonContent, IonHeader, IonTitle, modalController, IonButton, IonToolbar, IonButtons, IonIcon,  IonAccordion, IonAccordionGroup, IonItem, IonLabel } from "@ionic/vue";
import { thumbsUpOutline, thumbsDownOutline, createOutline } from 'ionicons/icons';
=======
import { IonContent, IonHeader, IonPage, IonTitle, modalController, IonButton, IonButtons, IonToolbar, useIonRouter } from "@ionic/vue";

const ionRouter = useIonRouter();
>>>>>>> ec9496c53380837d3ee0c17ff6e01128a17c7167

// PROPS
const props = defineProps<{
  markerData: ListOfCases;
}>();

const emits = defineEmits<{
  (event: "onDismiss"): void;
}>();

async function closeModal() {
  await modalController.dismiss();
}

const routeToChangeCaseView = async () =>{
  await modalController.dismiss();
  ionRouter.push(`/change-case/${props.markerData[0].id}`);
}
</script>
