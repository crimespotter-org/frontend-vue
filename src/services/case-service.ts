import { Case, Casetype, Status } from "@/types/supabase-global";
import { supabase } from "./supabase-service";

class CaseService {

  async updateCase(
    case_id: string,
    case_type: Casetype,
    crime_date_time: string,
    email: string,
    lat: number,
    long: number,
    place_name: string,
    status: Status,
    summary: string,
    title: string,
    zip_code: number
  ): Promise<void> {
    const { data, error } = await supabase.rpc('update_case', {
        case_id, 
        case_type, 
        crime_date_time, 
        email, 
        lat, 
        long, 
        place_name, 
        status, 
        summary, 
        title, 
        zip_code
      })
    if (error) console.error(error);
  }

  async getCase(case_id_param: string) : Promise<Case> {
      const { data: cases, error } = await supabase.rpc('get_case_details_angular', 
      {
        case_id_param
      });
      if (error) {
        console.error("Fehler beim Abrufen der Daten:", error.message);
        return [];
      }
      console.log(cases);
      return cases;
  }
}

export const caseService = new CaseService();