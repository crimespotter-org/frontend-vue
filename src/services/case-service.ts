import { Case, Casetype, Status } from "@/types/supabase-global";
import { supabase } from "./supabase-service";
import { FileObject } from '@supabase/storage-js'

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
    const { data, error } = await supabase.rpc("update_case", {
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
      zip_code,
    });
    if (error) console.error(error);
  }

  async getCase(case_id_param: string): Promise<Case> {
    const { data: cases, error } = await supabase.rpc(
      "get_case_details_angular",
      {
        case_id_param,
      }
    );
    if (error) {
      console.error("Fehler beim Abrufen der Daten:", error.message);
      return [];
    }
    console.log(cases);
    return cases;
  }

  async getCaseImagesFromStorage(caseId: string): Promise<FileObject[]|null> {
    const { data: caseImage, error } = await supabase.storage
      .from("media")
      .list(`case-${caseId}`, {
        limit: 5,
      });
    if (error) {
      console.error("Fehler beim Abrufen der Bilder:", error.message);
    }
    console.log(caseImage);

    return caseImage;
  }

  async deleteCaseImageFromStorage(imageName: string, caseId: string) : Promise<boolean> {
    const { data, error } = await supabase
      .storage
      .from("media")
      .remove([`case-${caseId}/${imageName}`]);
      if(error){
        console.error("Fehler beim Abrufen der Bilder:", error.message);
        return false;
      }
      return true;
  }

  async getPublicUrl(imageName: string, caseId: string) : Promise<string>{
    const { data, error } = await supabase.storage
      .from("media")
      .createSignedUrl(`case-${caseId}/${imageName}`, 60);

      if(error){
        console.error("Fehler beim Abrufen der Bilder:", error.message);
      }

      return data!.signedUrl;
  }
}

export const caseService = new CaseService();
