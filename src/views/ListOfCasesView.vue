<template>
    <ion-page>
        <HeaderComponent />
        <ion-content class="case ion-padding" :fullscreen="true" :scroll-events="true">
            <p>Klicke auf einen Fall um mehr zu sehen!</p>
            <ion-list>
                <ion-item v-for="(c, index) in cases" :key="index" class="case customTransparent" @click="caseClicked(c)">
                    <ion-grid class="customTransparent">
                        <ion-row>
                            <IonTitle>{{ c.title }}</IonTitle>
                        </ion-row>
                        <ion-row class="flex gap-x-4">
                            <ion-icon :icon="locationOutline"></ion-icon>
                            <p>{{ c.place_name }}</p>
                        </ion-row>
                        <ion-row class="flex gap-x-4">
                            <ion-icon :icon="calendarOutline"></ion-icon>
                            <p> {{ modifyDate(c.crime_date_time) }}</p>
                        </ion-row>
                        <ion-row class="flex gap-x-4">
                            <ion-icon :icon="setIcon(c.status)"></ion-icon>
                            <p>{{ setStatus(c.status) }}</p>
                        </ion-row>
                        <ion-row class="flex gap-x-4">
                            <ion-icon :icon="constructOutline"></ion-icon>
                            <p>{{ setCaseType(c.case_type) }}</p>
                        </ion-row>
                    </ion-grid>
                </ion-item>
            </ion-list>
            <ion-modal ref="modalRef" :can-dismiss="canDismiss" color="primary">
                <crime-profile :markerData="caseToPass" :modal="modalRef" />
            </ion-modal>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonList,
    IonItem,
    IonIcon,
    IonPage,
    IonContent,
    IonTitle,
    IonGrid,
    IonRow,
    IonModal
} from '@ionic/vue';
import CrimeProfile from "../components/CrimeProfile.vue";
import { onMounted, ref } from 'vue';
import HeaderComponent from '../components/Header.vue';
import { mapService } from '../services/map-service';
import { FilteredCases, Status, Casetype } from '../types/supabase-global';
import { alertCircleOutline, checkmarkCircleOutline, locationOutline, calendarOutline, constructOutline } from 'ionicons/icons';

const cases = ref<FilteredCases>([]);
const modalRef = ref();
let caseToPass: FilteredCases = [];

onMounted(async () => {
    const currentLocation = await mapService.currentLocation();
    cases.value = await mapService.getFilteredCases(currentLocation.latitude, currentLocation.longitude, 1000000, null, null);
})

const canDismiss = async () => {
    return true;
};

const caseClicked = (event: { id: string }) => {
    console.log(event.id);
    caseToPass = cases.value.filter(
        (m) =>
            m.id === event.id
    );

    modalRef.value.$el.present();
}

function setStatus(status: Status): string {
    let stateOfCaseGerman = "";

    if (status == "closed") {
        stateOfCaseGerman = "Fall geschlossen";
    } else {
        stateOfCaseGerman = "Fall ungelöst";
    }
    return stateOfCaseGerman;
}

function setIcon(status: Status): string {
    let iconName = "";

    if (status == "closed") {
        iconName = checkmarkCircleOutline;
    } else {
        iconName = alertCircleOutline;
    }
    return iconName;
}

function setCaseType(type: Casetype): string {
    let typeOfCaseGerman = "";
    if (type == "murder") {
        typeOfCaseGerman = "Mord";
    } else if (type == "theft") {
        typeOfCaseGerman = "Diebstahl";
    } else if (type == "robbery-murder") {
        typeOfCaseGerman = "Raub mit Mord";
    } else if (type == "brawl") {
        typeOfCaseGerman = "Schlägerei";
    } else if (type == "rape") {
        typeOfCaseGerman = "Vergewaltigung";
    }
    return typeOfCaseGerman;
}

function modifyDate(dateTime: string): string {
    const crimeDateTime = new Date(dateTime);
    let formattedDate = crimeDateTime.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    formattedDate += ' Uhr';
    console.log(formattedDate);
    return formattedDate
}

</script>
<style scoped>
.custom-transparent {
    background-color: rgba(255, 255, 255, 0);
    /* Hintergrundfarbe transparent setzen */
    --box-shadow: none;
}
</style>
