<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Account erstellen</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="m-4">
                <ion-list>
                    <ion-item>
                        <ion-label position="floating">Name</ion-label>
                        <ion-input v-model="name"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="floating">E-Mail-Adresse</ion-label>
                        <ion-input type="email" v-model="email"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="floating">Passwort</ion-label>
                        <ion-input type="password" v-model="password"></ion-input>
                    </ion-item>
                </ion-list>
                <ion-button expand="full" @click="createAccount">Account erstellen</ion-button>
            </div>
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
    IonSelectOption
} from "@ionic/vue";
import { ref } from "vue";
import { supabase } from "@/services/supabase-service";
import router from '../router'

//variable email and password
let email = ref("");
let password = ref("");
let name = ref("");


async function createAccount() {

    const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
            data: {
                first_name: name.value
             
            }
        }
    });

   

    if (!error) {
        console.log("Create Account");
        router.push('/crime-map');
    } else {
        console.log(error)
    }
}
</script>
