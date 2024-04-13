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
import { Role } from "@/types/supabase-global";

//variable email and password
let email = ref("");
let password = ref("");
let role_crimespotter: Role;


async function createAccount() {
    role_crimespotter = "crimespotter";

    /*const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
    });

    if (!error) {*/

        const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    });

    if (!loginError) {
        const localUser = await supabase.auth.getSession();
        console.log(localUser.data.session?.user.id);

        const { data: upsertData, error: upsertError } = await supabase
            .from('user_profiles')
            .upsert({ id: localUser.data.session?.user.id, username: email.value, role: role_crimespotter })
            .select()

        if (!upsertError) {
            router.push('/crime-map');
        }
        else {
            console.log("Upsert Error" + upsertError);
        }
    }        
   /* } else {
        console.log("Auth Error" + error);
    }*/

};


</script>
