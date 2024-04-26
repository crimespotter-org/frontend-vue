<template>
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
</template>

<script setup lang="ts">
import { ListOfCases } from "@/types/supabase-global";
import { IonContent, IonHeader, IonPage, IonTitle, modalController, IonButton, IonButtons, IonToolbar, useIonRouter } from "@ionic/vue";

const ionRouter = useIonRouter();

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
