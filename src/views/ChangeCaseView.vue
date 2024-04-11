<template>
    <ion-page v-if="dataLoaded" class="crimeMap">
        <ion-header>
            <ion-toolbar class="crimeHeader">
                <ion-title>Case Bearbeiten</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-button @click="updateCase">Test Update</ion-button>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton
 } from '@ionic/vue';
import {caseService} from '@/services/case-service'; 

const dataLoaded = true;

const updateCase = () => {
    caseService.updateCase(
        "713af3b1-16cf-4a44-893d-5280f1fbfbd9",
        "robbery-murder",
        "28.12.2000",
        "emma.weiss2000@gmail.com",
        48.457675,
        8.697503,
        "Horb",
        "open",
        "Inmitten des geschäftigen Treibens eines Döner-Imbisses entstand plötzlich ein hitziger Streit zwischen einem Angestellten und einem türkischen Gast. Die Situation eskalierte rasch, als der Angestellte offenbar ein Messer zog und dem Gast mehrere Stiche zufügte. Spekulationen über die Tatwaffe sorgten für Aufsehen - soll es wirklich das Döner-Messer gewesen sein? Eine Frage, die die Gemüter zusätzlich erhitzte. Die Polizei rückte daraufhin zum Tatort vor einem Einkaufsmarkt aus, wo sich ein bedrückendes Szenario entfaltete. Real-Mitarbeiter versuchten hektisch, den Bereich abzusperren, während verzweifelte Angehörige des Opfers von Emotionen überwältigt waren. Der Ruf Hurensohn durchdrang die Luft, während die Beamten mühevoll versuchten, die Gemüter zu beruhigen und weitere Zwischenfälle zu verhindern. Währenddessen kämpfte die Mutter des Opfers im Krankenhaus um Fassung, während der Vater verzweifelt versuchte, einen letzten Blick auf seinen Sohn zu erhaschen. Die Szenerie war geprägt von Trauer und Unverständnis, während Real-Mitarbeiter und Seelsorger versuchten, die Lage zu beruhigen und erste Informationen zu sammeln. Im Laufe der Nacht kehrte langsam Ruhe ein, während die Polizei mit den Ermittlungen begann und die Hintergründe dieser tragischen Tat zu ergründen versuchte. In einem Bestattungshaus in Albstadt wartete der Leichnam des Opfers darauf, seine letzte Ruhe zu finden. Doch die Geschichte endet nicht hier - sie hinterließ drei kleine Kinder, deren Zukunft nun im Schatten dieser Tragödie liegt.",
        "Tödliche Messerstecherei am Döner-Stand",
        72160
    );
}

</script>