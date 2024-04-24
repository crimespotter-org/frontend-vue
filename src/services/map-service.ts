import { supabase } from "./supabase-service";
import {
  ListOfCases,
  Coordinate,
  Status,
  Casetype,
  FilteredCases
} from "@/types/supabase-global";
import { Geolocation } from "@capacitor/geolocation";
import { Loader } from "@googlemaps/js-api-loader";

class MapService {
  public loader: Loader | undefined;
  public googleAPIKey = "AIzaSyCJbAjIZqv32gJ4BeiuomscFObUAUGe-AM";
  public markers: google.maps.Marker[];
  public infoWindow: google.maps.InfoWindow | undefined;
  public map: google.maps.Map | undefined;
  public mapDiv: HTMLElement = document.createElement("div");

  constructor() {
    this.loader = new Loader({
      apiKey: this.googleAPIKey,
      version: "weekly",
    });
    this.loader.load().then(async () => {
      this.map = await new window.google.maps.Map(this.mapDiv, {
        zoom: 16,
        disableDefaultUI: true,
      });
      this.infoWindow = new google.maps.InfoWindow();
    });
    this.markers = [];
  }

  createMarker(
    lat: number,
    lng: number,
    map: google.maps.Map | undefined,
    caseTitle: string,
    windowContent: string
  ) {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      icon: "",
      title: caseTitle,
      optimized: false,
    });

    marker.addListener("click", async () => {
      this.infoWindow?.close();
      this.infoWindow?.setContent(windowContent);
      this.infoWindow?.open(marker.getMap(), marker);
      this.infoWindow?.focus();
      map?.setCenter(new google.maps.LatLng(lat, lng));
    });

    this.markers.push(marker);
  }

  showMarkersOnMap(map: google.maps.Map | undefined) {
    this.markers.forEach((marker) => marker.setMap(map as google.maps.Map));
    mapService.map?.setZoom(10);
  }

  deleteMarkers() {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }


  async getAllCases(): Promise<ListOfCases> {
    const { data: cases, error } = await supabase.rpc("get_all_cases");
    if (error) {
      console.error("Fehler beim Abrufen der Daten:", error.message);
      return [];
    }
    console.log("get_all_cases");
    console.log(cases);
    return cases;
  }

  async currentLocation(): Promise<Coordinate> {
    const currentLocation = await Geolocation.getCurrentPosition();
    const coordinate = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };
    return coordinate;
  }

  async getFilteredCases(
    currentlat: number,
    currentlong: number,
    distance: number,
    case_status: Status,
    crime_types: Casetype,
  ): Promise<FilteredCases> {
    distance = distance * 1000;
    const end_date = null;
    const start_date = null;
    const { data: cases, error } = await supabase.rpc('get_filtered_cases_angular', {
      case_status, 
      crime_types, 
      currentlat, 
      currentlong, 
      distance, 
      end_date, 
      start_date
    })
    if (error) {
      console.error("Fehler beim Abrufen der Daten: ", error.message);
      return [];
    }
    console.log("get_filtered_cases");
    console.log(cases);
    return cases;
  }
}

export const mapService = new MapService();
