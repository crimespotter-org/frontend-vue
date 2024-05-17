<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Registrierung erfolgreich</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="unauthorized-view">
          <p>Die Registrierung war erfolgreich.</p>
          <p>Bitte verifiziere Deine E-Mail-Adresse.</p>
          <ion-button class="mt-4">
            <router-link to="login">Zur Anmeldung</router-link>
          </ion-button>         
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
