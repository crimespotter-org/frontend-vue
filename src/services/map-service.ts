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
  public map: google.maps.Map;
  public mapDiv: HTMLElement = document.createElement("div");
  public location: Coordinate;

  constructor() {
    this.loader = new Loader({
      apiKey: this.googleAPIKey,
      version: "weekly",
    });
    this.loader.load().then(async () => {
      this.location = await this.currentLocation();
      this.map = await new window.google.maps.Map(this.mapDiv, {
        center: new google.maps.LatLng(this.location.latitude, this.location.longitude),
        zoom: 16
      });
    });
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
