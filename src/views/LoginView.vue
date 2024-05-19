<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Login</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <div class="login-form">
                <ion-item>
                    <ion-label position="floating" aria-label="email">E-Mail-Adresse</ion-label>
                    <ion-input type="email" id="email" v-model="email"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating" aria-label="password">Passwort</ion-label>
                    <ion-input type="password" id="password" v-model="password"></ion-input>
                </ion-item>
                <ion-button expand="full" @click="login">Anmelden</ion-button>
            </div>

            <div class="buttonContainer">
                <router-link to="/create-Account"> <ion-button>Account erstellen</ion-button> </router-link>
            </div>
            <ion-toast :is-open="changeNotSuccesful" @didDismiss="setOpenChangeSuccessful(false)"
                message="{{ changemessage }}" :duration="5000"></ion-toast>

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
import { ref } from "vue";
import { supabase } from "@/services/supabase-service";
import router from '../router'

//variable email and password
let email = ref("");
let password = ref("");
let changeNotSuccesful = ref(false);
let changemessage = ref("");


//Login
async function login() {

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    });
    if (!error) {
        router.push('/crime-map');
    } else {
        console.log(error);
        changemessage.value = "Die Anmeldung war nicht erfolgreich: " + error;
        changeNotSuccesful.value = true;

    }
}


const setOpenChangeSuccessful = (state: boolean) => {
    changeNotSuccesful.value = state;
};

</script>
