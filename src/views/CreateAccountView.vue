<template>
    <ion-page>
        <ion-header class="flex">
            <ion-toolbar color="primary">
                <div class="flex">
                    <ion-button @click="backToLogin" class="customTransparentAndShadowNone">
                        <ion-icon :icon="arrowBack" />
                    </ion-button>
                    <ion-title>Account erstellen</ion-title>
                </div>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="m-4">
                <ion-list>
                    <ion-item>
                        <ion-label position="floating">E-Mail-Adresse</ion-label>
                        <ion-input type="email" v-model="email"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="floating">Passwort</ion-label>
                        <ion-input type="password" v-model="password"></ion-input>
                    </ion-item>
                </ion-list>
                <ion-button id="open-loading" expand="full" @click="createAccount">Account erstellen</ion-button>
                <ion-loading trigger="open-loading" :duration="3000"
                    message="Account wird angelegt. Sie werden gleich weitergeleitet."> </ion-loading>
            </div>

            <ion-toast trigger="open-toast" :is-open="isToastOpen" :message=ToastMessage :duration="5000"
                @didDismiss="setOpen(false)"></ion-toast>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
//Function for creating an account
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
    IonSelectOption,
    IonLoading,
    IonList
} from "@ionic/vue";
import { ref } from "vue";
import { supabase } from "@/services/supabase-service";
import router from '../router';
import { arrowBack } from 'ionicons/icons';

//variable email and password
let email = ref("");
let password = ref("");
const isToastOpen = ref(false);
let ToastMessage: string;

async function createAccount() {
    const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
    });

    if (!error) {
        router.push('/emailVerification');

    } else {
        ToastMessage = "Bei der Registrierung ist ein Fehler aufgetreten.";
        setOpen(true);
    }

};


function backToLogin() {
    router.push('/login');
}


const setOpen = (state: boolean) => {
    isToastOpen.value = state;
};

</script>