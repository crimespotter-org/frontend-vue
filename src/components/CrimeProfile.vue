<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{props.markerData[0].title}}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="closeModal()"><ion-icon name="close-outline"></ion-icon></ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <p>{{props.markerData[0].title}}</p>
    <ion-button>Case bearbeiten</ion-button>
    <p>{{props.markerData[0].summary}}</p>
    <p>{{props.markerData[0].status}}</p>  
  </ion-content>
</template>

<script lang="ts" setup>
import { ListOfCases } from "@/types/supabase-global";
import { IonContent, IonHeader, IonTitle, modalController, IonButton } from "@ionic/vue";

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
</script>
