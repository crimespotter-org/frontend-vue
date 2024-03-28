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
  </ion-content>
</template>

<script setup lang="ts">
import { AllCases } from "@/types/supabase-global";
import { IonContent, IonHeader, IonTitle, modalController } from "@ionic/vue";

// PROPS
const props = defineProps<{
  markerData: AllCases;
}>();

const emits = defineEmits<{
  (event: "onDismiss"): void;
}>();

async function closeModal() {
  await modalController.dismiss();
}
</script>
