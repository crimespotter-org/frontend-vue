<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Case Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item v-for="(item, index) in dbMarkers" :key="index">
          <ion-list>
            <ion-item v-for="(itemInArray, index2) in item" :key="index2">
              <ion-label>
                <h2>{{ itemInArray.title }}</h2>
                <p>{{ itemInArray.summary }}</p>
                <!-- Weitere Daten anzeigen, falls erforderlich -->
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { mapService } from "../services/map-service";

const dbMarkers = ref([]);

onMounted(async () => {
  const dbMarkers = await mapService.getAllCases();
});
</script>

<style scoped>
/* Stil für die gerenderte Liste hier hinzufügen */
</style>
