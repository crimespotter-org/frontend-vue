<template>
    <ion-page>
        <HeaderComponent />
        <ion-content v-if="!dataLoaded" class="spinner-content">
            <ion-spinner></ion-spinner>
        </ion-content>
        <ion-content class="ion-padding case" v-if="dataLoaded">
            <ion-toolbar class="customTransparent">
                <ion-segment v-model="segment" color="primary">
                    <ion-segment-button value="info">
                        <ion-label>Info</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="picture">
                        <ion-label>Bilder</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="links">
                        <ion-label>Links</ion-label>
                    </ion-segment-button>
                </ion-segment>
            </ion-toolbar>
            <ion-card v-show="segment === 'info'" class="customTransparent">
                <ion-item class="customTransparent">
                    <ion-title :auto-grow="true">
                        Fall bearbeiten
                    </ion-title>
                </ion-item>
                <ion-item class="customTransparent">
                    <ion-textarea ref="ionInputTitle" label="Titel: " :value="detailCase[0].title"
                        :auto-grow="true"></ion-textarea>
                </ion-item>

                <ion-item class="customTransparent">
                    <ion-textarea ref="ionInputSummary" label="Inhalt:" :value="detailCase[0].summary"
                        :rows="16"></ion-textarea>
                </ion-item>

                <ion-item class="customTransparent">
                    <input :value="PlaceName" @focus="setLocation" id="search1" type="search" autocomplete="on"
                        placeholder="Geben sie einen Standort ein." style="width: 100%; padding: 10px;">
                </ion-item>

                <ion-item class="customTransparent">
                    <ion-select aria-label="Fallstatus" label="Fallstatus" label-placement="floating" fill="solid"
                        :value="CaseStatus" @ionChange="handleStatusChange">
                        <ion-select-option value="closed">Gelöst</ion-select-option>
                        <ion-select-option value="open">Ungelöst</ion-select-option>
                    </ion-select>
                </ion-item>

                <ion-item class="customTransparent">
                    <ion-select label="Straftat" label-placement="floating" fill="solid" aria-label="Straftat"
                        :value="CaseType" @ionChange="handleCaseTypeChange">
                        <ion-select-option value="murder">Mord</ion-select-option>
                        <ion-select-option value="theft">Diebstahl</ion-select-option>
                        <ion-select-option value="robbery-murder">Raub mit Mord</ion-select-option>
                        <ion-select-option value="brawl">Schlägerei</ion-select-option>
                        <ion-select-option value="rape">Vergewaltigung</ion-select-option>
                    </ion-select>
                </ion-item>


                <ion-item class="customTransparent">
                    <ion-grid>
                        <ion-row>
                            <ion-col size="3" class="my-auto mx-2">
                                <ion-fab-button @click="onCalenderClickEvent" color="secondary">
                                    <ion-icon :icon="calendarOutline"></ion-icon>
                                </ion-fab-button>
                            </ion-col>
                            <ion-col>
                                <div>
                                    <ion-label>Tatdatum:</ion-label>
                                    <ion-input ref="ionInputCrimeDate" :readonly="true" :value="CrimeDate"></ion-input>
                                </div>
                                <div>
                                    <ion-label>Tatzeit:</ion-label>
                                    <ion-input ref="ionInputCrimeTime" :readonly="true" :value="CrimeTime"></ion-input>
                                </div>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col size="3">
                                <ion-button @click="updateCase">Updaten</ion-button>
                            </ion-col>
                            <ion-col size="5">
                            </ion-col>
                            <ion-col size="4">
                                <ion-button @click="navigateBack">Zurück</ion-button>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-item>
            </ion-card>
            <ion-card v-show="segment === 'picture'" class="customTransparent">
                <ion-card-content class="customTransparent">
                    <ion-list class="custom-transparent">
                        <ion-item v-for="(pic, index) of picture" :key="index" class="customTransparent">
                            <ion-thumbnail slot="start">
                                <ion-img alt="Hier sollte ein Bild sein" :src=pic.pictureUri />
                            </ion-thumbnail>
                            <div>
                                <ion-label>{{ pic.imageName }}</ion-label>

                                <ion-button @click="deletePicture(pic)">
                                    <ion-icon :icon="trashOutline"></ion-icon>
                                </ion-button>
                            </div>
                        </ion-item>
                    </ion-list>
                    <div class="flex justify-center customTransparent">
                        <ion-button @click="takePhoto">
                            <ion-icon :icon="cameraOutline"></ion-icon>
                        </ion-button>
                    </div>
                </ion-card-content>
            </ion-card>
            <ion-card v-show="segment === 'links'" class="customTransparent">
                <ion-card-content class="customTransparent">
                    <p class="text-black"> Updaten über den Update Button auf der Info Seite! </p>
                    <ion-list class="custom-transparent text-black">
                        <div v-for="(link, index) in linkList" :key="index">
                            <ion-grid>
                                <ion-row>
                                    <ion-col>
                                        <ion-select :value="link.type" @ionChange="changeLinkType(link, $event)">
                                            <ion-select-option value="newspaper">📰Zeitung</ion-select-option>
                                            <ion-select-option value="podcast">🎧Podcast</ion-select-option>
                                            <ion-select-option value="book">📖Buch</ion-select-option>
                                        </ion-select>
                                    </ion-col>
                                    <ion-col>
                                        <a :href=link.linkUrl>{{ link.linkUrl }}</a>
                                    </ion-col>
                                    <ion-col>
                                        <ion-button @click="deleteLink(link)">
                                            <ion-icon :icon="trashOutline"></ion-icon>
                                        </ion-button>
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </div>
                    </ion-list>
                    <ion-item class="customTransparent">
                        <ion-select ref="linkTypRef" value="newspaper">
                            <ion-select-option value="newspaper">📰Zeitung</ion-select-option>
                            <ion-select-option value="podcast">🎧Podcast</ion-select-option>
                            <ion-select-option value="book">📖Buch</ion-select-option>
                        </ion-select>
                        <ion-input ref="linkInputUrl" placeholder="Url"></ion-input>
                        <ion-button @click="includeLink">
                            <ion-icon slot="icon-only" :icon="arrowUpOutline"></ion-icon>
                        </ion-button>
                    </ion-item>
                </ion-card-content>
            </ion-card>

            <ion-modal ref="modal" :initial-breakpoint="0.75">
                <ion-header class="px-4">
                    <ion-toolbar>
                        <ion-button @click="cancel()" slot="start">Zurück</ion-button>
                        <ion-button @click="confirm()" slot="end">Anwenden</ion-button>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-datetime display-format="YYYY-MM-DDTHH:mm:ssTZD" v-model="SelectedDateTime"></ion-datetime>
                </ion-content>
            </ion-modal>

            <ion-toast trigger="open-toast" :is-open="isToastOpen" :message=ToastMessage :duration="5000"
                @didDismiss="setOpen(false)"></ion-toast>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted } from "vue";
import {
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonPage,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonFabButton,
    IonIcon,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonImg,
    IonCard,
    useIonRouter,
    IonToast,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonCardContent,
    IonThumbnail,
    IonTitle,
    IonSpinner,
onIonViewDidEnter
} from '@ionic/vue';
import { caseService } from '@/services/case-service';
import { calendarOutline, cameraOutline, trashOutline, arrowUpOutline } from "ionicons/icons";
import { useRoute } from "vue-router";
import { Case, Status, Casetype, ImageData, Link, LinkType } from "@/types/supabase-global";
import HeaderComponent from '../components/Header.vue';
import { currentUserInformation } from "@/services/currentUserInformation-service";
import { cameraService } from '../services/camera-service';

const ionRouter = useIonRouter();
const dataLoaded = ref<boolean>(false);
const modal = ref();
const isToastOpen = ref(false);
const route = useRoute();
const ionInputTitle = ref();
const ionInputSummary = ref();
const ionInputCrimeDate = ref();
const ionInputCrimeTime = ref();
const linkInputUrl = ref();
const segment = ref('info');
const linkList = ref<Link[]>([]);

const picture = ref<ImageData[]>([]);
let detailCase: Case;
let SelectedDateTime: string;
let CaseType: Casetype;
let CaseStatus: Status;
let CrimeTime: string;
let CrimeDate: string;
let CaseId: string;
let Latitude: number;
let Longitude: number;
let PlaceName: string;
let ToastMessage: string;
const linkTypRef = ref<LinkType>('newspaper');
let localUserId: string = "";
const pictureToSave: File[] = [];
let number: number = 0;

const cancel = () => {
    modal.value.$el.dismiss(null, 'cancel');
}

const confirm = () => {
    console.log(SelectedDateTime)
    CrimeDate = convertDateString(SelectedDateTime);
    console.log(SelectedDateTime);
    ionInputCrimeDate.value.$el.value = CrimeDate;
    ionInputCrimeTime.value.$el.value = CrimeTime;
    modal.value.$el.dismiss(null, 'cancel');
}

onIonViewDidEnter(async () =>{
    dataLoaded.value = false;
    CaseId = route.params['caseId'].toString();
    detailCase = await caseService.getCase(CaseId);
    SelectedDateTime = SelectedDateTimeFunction(detailCase[0].crime_date_time);

    localUserId = (await currentUserInformation.getCurrentUser()).data.session!.user.id;

    console.log(detailCase[0].crime_date_time);
    CrimeDate = convertDateString(detailCase[0].crime_date_time);
    CaseType = detailCase[0].case_type;
    CaseStatus = detailCase[0].status;
    Latitude = detailCase[0].lat;
    Longitude = detailCase[0].long;
    PlaceName = detailCase[0].place_name;

    getPictures();

    detailCase.forEach(function (item) {
        console.log(item.link_id + "Link");
        const link: Link = {
            linkId: item.link_id,
            type: item.link_type,
            linkUrl: item.url
        };
        linkList.value.push(link);
    });

    dataLoaded.value = true;
})

onMounted(async () => {
    CaseId = route.params['caseId'].toString();
    detailCase = await caseService.getCase(CaseId);
    SelectedDateTime = SelectedDateTimeFunction(detailCase[0].crime_date_time);

    localUserId = (await currentUserInformation.getCurrentUser()).data.session!.user.id;

    CrimeDate = convertDateString(detailCase[0].crime_date_time);
    CaseType = detailCase[0].case_type;
    CaseStatus = detailCase[0].status;
    Latitude = detailCase[0].lat;
    Longitude = detailCase[0].long;
    PlaceName = detailCase[0].place_name;

    getPictures();

    detailCase.forEach(function (item) {
        console.log(item.link_id + "Link");
        const link: Link = {
            linkId: item.link_id,
            type: item.link_type,
            linkUrl: item.url
        };
        linkList.value.push(link);
    });

    dataLoaded.value = true;
});

const getPictures = async () => {
    const caseImages = await caseService.getCaseImagesFromStorage(CaseId);
    await Promise.all(caseImages!.map(async (file) => {
        const pictureUri = await caseService.getPublicUrl(file.name, CaseId);
        const imageData: ImageData = {
            pictureUri: pictureUri,
            imageName: file.name
        };
        picture.value.push(imageData);
    }));
}

const setLocation = () => {

    const elem = document.getElementById("search1") as HTMLInputElement;
    console.log(elem);

    const autocomplete = new window.google.maps.places.Autocomplete(elem);
    const returnFields = ["geometry", "name"];
    autocomplete.setFields(returnFields);
    window.google.maps.event.addListener(autocomplete, 'place_changed', function () {
        const place = autocomplete.getPlace();
        const location = place['geometry']!['location'];
        Latitude = location!.lat();
        Longitude = location!.lng();
        PlaceName = place.name!;
    });
};

const updateCase = async () => {
    const successful = await caseService.updateCase(
        CaseId,
        CaseType,
        localUserId,
        SelectedDateTime,
        Latitude,
        Longitude,
        PlaceName,
        CaseStatus,
        ionInputSummary.value.$el.value,
        ionInputTitle.value.$el.value,
        null,
        linkList.value
    );

    if (successful) {
        ToastMessage = "Case erfolgreich geupdatet!";
        setOpen(true);
    } else {
        ToastMessage = "Etwas lief schief probier es später nochmal!"
        setOpen(true);
    }

    pictureToSave.forEach(async (file) => {
        await cameraService.uploadPhoto(file, CaseId);
    })

};

function convertDateString(inputDate: string): string {
    const date = new Date(inputDate);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    CrimeTime = `${hours}:${minutes}:${seconds}`;
    return `${day}.${month}.${year}`;
}

function SelectedDateTimeFunction(inputDate: string): string {
    const date = new Date(inputDate);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`; //2017-03-05T11:00:00
}

const deletePicture = async (deletePicture: ImageData) => {
    const successful = await caseService.deleteCaseImageFromStorage(deletePicture.imageName, CaseId);

    if (successful) {
        picture.value = picture.value.filter(item => item.pictureUri !== deletePicture.pictureUri);
        ToastMessage = "Bild erfolgreich gelöscht";
        setOpen(true);
    } else {
        ToastMessage = "Etwas lief schief probiere es später nochmal!";
        setOpen(true);
    }

};

const takePhoto = async () => {
    number++;
    const getPhoto = await cameraService.takePhoto();
    const blob = await fetch(getPhoto.webPath!).then(async (r) => {
        return new Blob([await r.arrayBuffer()], { type: `image/${getPhoto.format}` });
    });
    const file = new File([blob], number.toString(), {
        type: blob.type,
    });

    const imageData: ImageData = {
        pictureUri: getPhoto.webPath!,
        imageName: file.name
    };
    picture.value.push(imageData);
    pictureToSave.push(file);
}


const navigateBack = () => {
    ionRouter.push("/crime-map");
};

const deleteLink = (link: Link) => {
    console.log(link);
    linkList.value = linkList.value.filter(function (item) {
        return item !== link;
    });
};

const includeLink = () => {

    console.log(linkTypRef.value.$el.value);

    const link: Link = {
        linkId: "",
        type: linkTypRef.value.$el.value,
        linkUrl: linkInputUrl.value.$el.value
    };
    linkList.value.push(link);
};

const changeLinkType = (link: Link, type: { detail: { value: LinkType } }) => {
    let linkId = ""

    if (link.linkId !== "") {
        linkId = link.linkId;
    }

    linkList.value = linkList.value.filter(function (item) {
        return item !== link;
    });

    console.log(type.detail.value);

    const newLink: Link = {
        linkId: linkId,
        type: type.detail.value,
        linkUrl: link.linkUrl
    };
    linkList.value.push(newLink);

};

const onCalenderClickEvent = () => {
    modal.value.$el.present();
};

const handleStatusChange = async (event: { detail: { value: string } }) => {
    CaseStatus = event.detail.value as Status;
};

const handleCaseTypeChange = async (event: { detail: { value: string } }) => {
    CaseType = event.detail.value as Casetype;
};

const setOpen = (state: boolean) => {
    isToastOpen.value = state;
};
</script>

<style scoped>
.input-row {
    margin-bottom: 20px;
}

ion-button {
    --background: #990000;
}

ion-content {
    --background: transparent: !important;
}
</style>