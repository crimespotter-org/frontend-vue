import { Case, Casetype, Status, Link, CaseVote } from "@/types/supabase-global";
import { supabase } from "./supabase-service";
import { FileObject } from '@supabase/storage-js'

class CaseService {

  async updateCase(
    case_id: string,
    case_type: Casetype,
    created_by: string,
    crime_date_time: string,
    lat: number,
    long: number,
    place_name: string,
    status: Status,
    summary: string,
    title: string,
    zip_code: number | null,
    linkList: Link[]
  ): Promise<boolean> {

    console.log(linkList);

    const p_links = linkList.map(link => ({
      url: link.linkUrl,
      link_type: link.type
  }));

    const { data, error } = await supabase.rpc('update_case', {
      case_id, 
      case_type, 
      created_by, 
      crime_date_time, 
      lat, 
      long, 
      place_name, 
      status, 
      summary, 
      title, 
      zip_code,
      p_links
    })
    if (error){
      console.error(error);
      return false;
    } 
    return true;
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
        console.error("Fehler beim löschen des Bildes", error.message);
        return false;
      }
      return true;
  }

  async getVotes(p_case_id: string): Promise<CaseVote>{
    const { data: vote, error } = await supabase.rpc('get_case_votes_by_id', {
      p_case_id
    });
    if (error){
      console.error(error);
      return[];
    } 
    console.log(vote);
    return vote;
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
