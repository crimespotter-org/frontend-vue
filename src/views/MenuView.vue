<template>
    <ion-page>
        <HeaderComponent />

        <ion-content>
            <ion-list>
                <ion-item>Liste aller Fälle</ion-item>
                <ion-item v-if="isCrimefluencer">Fall hinzufügen</ion-item>
                <router-link to="/change-user-role" v-if="isAdmin"><ion-item>Benutzerrollen
                        ändern</ion-item></router-link>

            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem } from '@ionic/vue';
import { Role } from "@/types/supabase-global";
import HeaderComponent from '../components/Header.vue';
import { currentUserInformation } from '@/services/currentUserInformation-service';
import { onMounted, ref } from "vue";

const isAdmin = ref(false);
const isCrimefluencer = ref(false);

getCurrentUserRoleFromService();

async function getCurrentUserRoleFromService() {
    const currentUserRole: Role = await currentUserInformation.getCurrentUserRole();
    checkRole(currentUserRole);
}

function checkRole(currentUserRole: Role) {
    if (currentUserRole == "admin") {
        isAdmin.value = true;
        isCrimefluencer.value = true;
    }
    else if (currentUserRole == "crimefluencer") {
        isCrimefluencer.value = true;
    }
}

</script>