<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Fall Titel</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="closeModal()">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <p>Inhalt des Steckbriefes</p>
  </ion-content>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonTitle, modalController } from "@ionic/vue";

// PROPS
const props = defineProps<{
  markerData: { coordinate: any; title: string; snippet: string }[];
}>();

const emits = defineEmits<{
  (event: "onDismiss"): void;
}>();

async function closeModal() {
  await modalController.dismiss();
}
</script>
