<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Unauthorized</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="unauthorized-view">
          <p>Du bist nicht berechtigt.</p>
          <p>Bitte melde dich an, um fortzufahren.</p>
          <router-link to="login">Zur Anmeldung</router-link>
        </div>
      </ion-content>
    </ion-page>
  </template>

<script setup lang="ts">
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonPopover,
    modalController,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption
} from "@ionic/vue";


</script>
