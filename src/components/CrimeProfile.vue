<template>
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

  
</template>

<script lang="ts" setup>
import { ListOfCases } from "@/types/supabase-global";
import { IonContent, IonHeader, IonTitle, modalController, IonButton, IonToolbar, IonButtons, IonIcon,  IonAccordion, IonAccordionGroup, IonItem, IonLabel } from "@ionic/vue";
import { thumbsUpOutline, thumbsDownOutline, createOutline } from 'ionicons/icons';

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
