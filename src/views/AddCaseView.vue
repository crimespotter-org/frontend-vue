<template>
    <ion-page>
        <HeaderComponent />
        <ion-content v-if="!dataLoaded">
            <div class="grid content-center justify-center min-h-full">
                <ion-spinner></ion-spinner>
            </div>
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
            <!-- Segment one information -->
            <ion-card v-show="segment === 'info'" class="customTransparent">
                <ion-item class="customTransparent">
                    <ion-title :auto-grow="true">
                        Fall hinzufügen
                    </ion-title>
                </ion-item>
                <!-- title -->
                <ion-item class="customTransparent">
                    <ion-input v-model="title" ref="ionInputTitle" label="Titel" label-placement="floating"
                        :auto-grow="true"></ion-input>
                </ion-item>

                <!-- summary -->
                <ion-item class="customTransparent">
                    <ion-textarea ref="ionInputSummary" label="Zusammenfassung" label-placement="floating"
                        :auto-grow="true" v-model="summary"></ion-textarea>
                </ion-item>

                <!-- Location -->
                <ion-item class="customTransparent">
                    <input v-model="PlaceName" @focus="setLocation" id="search2" type="search" autocomplete="on"
                        placeholder="Geben sie einen Standort ein." style="width: 100%; padding: 10px;">
                </ion-item>

                <!-- state -->
                <ion-item class="customTransparent">
                    <ion-select aria-label="Fallstatus" label="Fallstatus" label-placement="floating"
                        :value="CaseStatus" @ionChange="handleStatusChange">
                        <ion-select-option value="closed">Gelöst</ion-select-option>
                        <ion-select-option value="open">Ungelöst</ion-select-option>
                    </ion-select>
                </ion-item>

                <!-- type -->
                <ion-item class="customTransparent">
                    <ion-select label="Straftat" label-placement="floating" aria-label="Straftat" :value="CaseType"
                        @ionChange="handleCaseTypeChange">
                        <ion-select-option value="murder">Mord</ion-select-option>
                        <ion-select-option value="theft">Diebstahl</ion-select-option>
                        <ion-select-option value="robbery-murder">Raub mit Mord</ion-select-option>
                        <ion-select-option value="brawl">Schlägerei</ion-select-option>
                        <ion-select-option value="rape">Vergewaltigung</ion-select-option>
                    </ion-select>
                </ion-item>

                <!-- case date -->
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
                                <ion-button @click="createCase">Erstellen</ion-button>
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


            <!-- segment two pictures -->
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



            <!-- segment three links -->
            <ion-card v-show="segment === 'links'" class="customTransparent">
                <ion-card-content class="customTransparent">
                    Updaten über den Update Button auf der Info Seite!
                    <ion-list class="custom-transparent">
                        <ion-item v-for="(link, index) in linkList" :key="index" class="customTransparent">
                            <ion-grid class="customTransparent">
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
                        </ion-item>
                    </ion-list>
                    <ion-item class="customTransparent case">
                        <ion-select ref="linkTypRef" class="customTransparent" value="newspaper">
                            <ion-select-option value="newspaper">📰Zeitung</ion-select-option>
                            <ion-select-option value="podcast">🎧Podcast</ion-select-option>
                            <ion-select-option value="book">📖Buch</ion-select-option>
                        </ion-select>
                        <ion-input ref="linkInputUrl" placeholder="Url"></ion-input>
                        <ion-button @click="includeLink">
                            <ion-icon :icon="arrowUpOutline"></ion-icon>
                        </ion-button>
                    </ion-item>
                </ion-card-content>
            </ion-card>




            <!-- modal calender -->
            <ion-modal ref="modal" :initial-breakpoint="0.75">
                <ion-header>
                    <ion-toolbar>
                        <ion-button @click="cancel()" slot="start">Zurück</ion-button>
                        <ion-button @click="confirm()" slot="end">Anwenden</ion-button>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-datetime display-format="YYYY-MM-DDTHH:mm:ssTZD" v-model="SelectedDateTime"></ion-datetime>
                </ion-content>
            </ion-modal>


            <!-- toast as information -->
            <ion-toast trigger="open-toast" :is-open="isToastOpen" :message=ToastMessage :duration="5000"
                @didDismiss="setOpen(false)"></ion-toast>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
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
    onIonViewDidLeave
} from '@ionic/vue';
import { ref, onMounted } from "vue";
import HeaderComponent from '../components/Header.vue';
import { Status, Casetype, ImageData, Link, LinkType } from "@/types/supabase-global";
import { calendarOutline, cameraOutline, trashOutline, arrowUpOutline } from "ionicons/icons";
import { caseService } from '@/services/case-service';
import { currentUserInformation } from "@/services/currentUserInformation-service";
import { cameraService } from '@/services/camera-service';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const ionRouter = useIonRouter();
const modal = ref();
const isToastOpen = ref(false);
const dataLoaded = ref<boolean>(false);

const ionInputTitle = ref();
const ionInputSummary = ref();
const ionInputCrimeDate = ref();
const ionInputCrimeTime = ref();
const linkInputUrl = ref();
const segment = ref('info');

const picture = ref<ImageData[]>([]);
const linkList = ref<Link[]>([]);
let SelectedDateTime: string;
let CaseType: Casetype;
let CaseStatus: Status;
let CrimeTime: string;
let CrimeDate: string;
let Latitude: number;
let Longitude: number;
let PlaceName: string;
let ToastMessage: string;
const linkTypRef = ref('newspaper');
let localUserId: string = "";
const pictureToSave: File[] = [];
let title: string;
let summary: string;
let number = 0;

onIonViewDidLeave(() => {
    CaseType = null;
    PlaceName = "";
    CaseStatus = null;
    ionInputSummary.value.$el.value = null;
    ionInputTitle.value = null;
    linkList.value = [];
    title = '';
    summary = '';
    picture.value = [];
})

onMounted(async () => {
    localUserId = (await currentUserInformation.getCurrentUser()).data.session!.user.id;
    dataLoaded.value = true;
})

const cancel = () => {
    modal.value.$el.dismiss(null, 'cancel');
}

const onCalenderClickEvent = () => {
    modal.value.$el.present();
};

const confirm = () => {
    splitDateTime(SelectedDateTime);
    ionInputCrimeDate.value.$el.value = CrimeDate;
    ionInputCrimeTime.value.$el.value = CrimeTime;
    SelectedDateTime = formatDateToISOWithTimezone(SelectedDateTime);
    modal.value.$el.dismiss(null, 'cancel');
}

function splitDateTime(dateTimeString: string): void {
    const [date, timeWithOffset] = dateTimeString.split('T');
    const [time] = timeWithOffset.split(/[+-]/); // berücksichtigt auch Zeitzonen-Offset
    CrimeDate = date;
    CrimeTime = time;
}

function formatDateToISOWithTimezone(dateString: string): string {
    const date = new Date(dateString);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = toZonedTime(date, timeZone);
    const formattedDate = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

    return formattedDate;
}

function formateDateForDb(dateString: string): string {
    const zonedDate = parseISO(dateString);
    const utcDate = new Date(zonedDate.getTime() - zonedDate.getTimezoneOffset() * 60000);
    const formattedUtcDate = format(utcDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    return formattedUtcDate
}

onIonViewDidLeave(() => {
    CaseType = null;
    PlaceName = "";
    CaseStatus = null;
    ionInputSummary.value.$el.value = "";
    ionInputTitle.value.$el.value = "";
    linkList.value = [];
    title = '';
    summary = '';
    picture.value = [];
    CrimeDate = "";
    CrimeTime = "";
})

const setLocation = () => {

    const elem = document.getElementById("search2") as HTMLInputElement;

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

const deleteLink = (link: Link) => {
    linkList.value = linkList.value.filter(function (item) {
        return item !== link;
    });
};

const includeLink = () => {
    const link: Link = {
        linkId: "",
        type: linkTypRef.value.$el.value,
        linkUrl: linkInputUrl.value.$el.value
    };
    linkList.value.push(link);
    linkInputUrl.value.$el.value = "";
};

const changeLinkType = (link: Link, type: { detail: { value: LinkType } }) => {

    linkList.value = linkList.value.filter(function (item) {
        return item !== link;
    });

    const newLink: Link = {
        linkId: "",
        type: type.detail.value,
        linkUrl: link.linkUrl
    };
    linkList.value.push(newLink);
};

const deletePicture = async (deletePicture: ImageData) => {
    picture.value = picture.value.filter(item => item.pictureUri !== deletePicture.pictureUri);
};

const takePhoto = async () => {
    number++;
    const getPhoto = await cameraService.takePhoto();
    const blob = await fetch(getPhoto.webPath!).then(async (r) => {
        return new Blob([await r.arrayBuffer()], { type: `image/${getPhoto.format}` });
    });
    const file = new File([blob], `${number}.${getPhoto.format}`, {
        type: blob.type,
    });

    const imageData: ImageData = {
        pictureUri: getPhoto.webPath!,
        imageName: `${file.name}`
    };
    picture.value.push(imageData);
    pictureToSave.push(file);
}

const handleStatusChange = async (event: { detail: { value: string } }) => {
    CaseStatus = event.detail.value as Status;
};

const handleCaseTypeChange = async (event: { detail: { value: string } }) => {
    CaseType = event.detail.value as Casetype;
};

const createCase = async () => {

    if (!CaseType || !localUserId || !SelectedDateTime || !Latitude || !Longitude || !PlaceName || !CaseStatus || !ionInputSummary.value.$el.value || !ionInputTitle.value.$el.value) {
        ToastMessage = "Bitte füllen Sie alle Felder aus, bevor Sie den Fall erstellen.";
        setOpen(true);
    } else {

        SelectedDateTime = formateDateForDb(SelectedDateTime);

        const caseId = await caseService.createCase(
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

        pictureToSave.forEach(async (file) => {
            await cameraService.uploadPhoto(file, caseId);
        })

        navigateBack();
    }
};

const navigateBack = () => {
    CaseType = null;
    PlaceName = "";
    CaseStatus = null;
    ionInputSummary.value.$el.value = "";
    ionInputTitle.value.$el.value = "";
    linkList.value = [];
    title = '';
    summary = '';
    picture.value = [];
    CrimeDate = "";
    CrimeTime = "";

    ionRouter.push("/crime-map");
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

.select-fill-solid {
    --background: white;
}

ion-content {
    --background: transparent: !important;
}


ion-searchbar.customTransparentAndShadowNoneSeearchbar {
    --background: #19422d00;
    --color: #000000;
    --placeholder-color: #000000;
    --icon-color: #000000;
    --clear-button-color: #000000;
    --box-shadow: none;
    --border-radius: 4px;
}


ion-searchbar.ios.custom {
    --cancel-button-color: #000000;
}

ion-searchbar.md.custom {
    --cancel-button-color: #000000;
}
</style>