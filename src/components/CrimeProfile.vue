<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Title</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="closeModal()">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <p>{{props.markerData[0].title}}</p>
    <ion-button @click="routeToChangeCaseView">Case bearbeiten</ion-button>
  </ion-content>
</template>

<script setup lang="ts">
import { ListOfCases } from "@/types/supabase-global";
import { IonContent, IonHeader, IonTitle, modalController, IonButton, IonButtons, IonToolbar } from "@ionic/vue";
import router from '../router'

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
  router.push(`/change-case/${props.markerData[0].id}`);
}
</script>
