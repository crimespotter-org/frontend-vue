import { supabase } from "./supabase-service";
import {
  Case,
  ListOfCases,
  Coordinate,
  Status,
  Casetype,
  FilteredCases
} from "@/types/supabase-global";
import { Geolocation } from "@capacitor/geolocation";

class MapService {
  async getMarkers(): Promise<Case[]> {
    const { data: cases, error } = await supabase.from("cases").select("*");
    if (error) {
      console.error("Fehler beim Abrufen der Daten:", error.message);
      return [];
    }
    console.log(cases);
    return cases;
  }

  async getAllCases(): Promise<ListOfCases> {
    const { data: cases, error } = await supabase.rpc("get_all_cases");
    if (error) {
      console.error("Fehler beim Abrufen der Daten:", error.message);
      return [];
    }
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

  async getNearbyCases(
    currentlat: number,
    currentlong: number,
    distance: number
  ): Promise<ListOfCases> {
    distance = distance * 1000;
    const { data: cases, error } = await supabase.rpc("find_nearby_cases", {
      currentlat,
      currentlong,
      distance,
    });
    if (error) {
      console.error("Fehler beim Abrufen der Daten: ", error.message);
      return [];
    }
    console.log(cases);
    return cases;
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
    console.log(cases);
    return cases;
  }
}

export const mapService = new MapService();
