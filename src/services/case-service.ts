import {
  Case,
  Casetype,
  Status,
  Link,
  CaseVote,
  Comment,
} from "@/types/supabase-global";
import { supabase } from "./supabase-service";
import { FileObject } from "@supabase/storage-js";

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
    const p_links = linkList.map((link) => ({
      url: link.linkUrl,
      link_type: link.type,
    }));

    const { data, error } = await supabase.rpc("update_case", {
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
      p_links,
    });
    if (error) {
      console.error(error);
      return false;
    }
    return true;
  }

  async createCase(
    p_case_type: Casetype,
    p_created_by: string,
    p_crime_date_time: string,
    p_latitude: number,
    p_longitude: number,
    p_place_name: string,
    p_status: Status,
    p_summary: string,
    p_title: string,
    p_zip_code: number | null,
    linkList: Link[]
  ): Promise<string> {
    const p_links = linkList.map((link) => ({
      url: link.linkUrl,
      link_type: link.type,
    }));

    const { data: caseId, error } = await supabase.rpc("create_crime_case_angular", {
      p_case_type,
      p_created_by,
      p_crime_date_time,
      p_latitude,
      p_links,
      p_longitude,
      p_place_name,
      p_status,
      p_summary,
      p_title,
      p_zip_code,
    });
    if (error) {
      console.error(error);
      return "";
    }
    console.log(caseId);
    return caseId;
  }

  async deleteCase(case_id: string) {
    const { data, error } = await supabase.rpc("delete_case_by_id", {
      case_id,
    });
    if (error) console.error(error);
    else console.log(data);
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

  async getCaseImagesFromStorage(caseId: string): Promise<FileObject[] | null> {
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

  async deleteCaseImageFromStorage(
    imageName: string,
    caseId: string
  ): Promise<boolean> {
    const { data, error } = await supabase.storage
      .from("media")
      .remove([`case-${caseId}/${imageName}`]);
    if (error) {
      console.error("Fehler beim löschen des Bildes", error.message);
      return false;
    }
    return true;
  }

  async getPublicUrl(imageName: string, caseId: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from("media")
      .createSignedUrl(`case-${caseId}/${imageName}`, 60);

    if (error) {
      console.error("Fehler beim Abrufen der Bilder:", error.message);
    }

    return data!.signedUrl;
  }

  async updateVote(
    caseId: string,
    userId: string,
    vote: number
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from("votes")
      .select("*")
      .match({ case_id: caseId, user_id: userId })
      .single();

    if (data) {
      const { error: updateError } = await supabase
        .from("votes")
        .update({ vote })
        .match({ id: data.id });
      if (updateError) {
        console.error(updateError);
        return false;
      }
      return true;
    } else {
      const { error: insertError } = await supabase
        .from("votes")
        .insert([{ case_id: caseId, user_id: userId, vote }]);
      if (insertError) {
        console.error(insertError);
        return false;
      }
      return true;
    }
  }

  async getVotes(p_case_id: string): Promise<CaseVote> {
    const { data: vote, error } = await supabase.rpc("get_case_votes_by_id", {
      p_case_id,
    });
    if (error) {
      console.error(error);
      return [];
    }
    console.log(vote);
    return vote;
  }

  async getComments(p_case_id: string): Promise<Comment> {
    const { data: comment, error } = await supabase.rpc("get_comments", {
      p_case_id,
    });
    if (error) console.error(error);
    return comment;
  }

  async insertComment(p_case_id: string, p_text: string, p_user_id: string): Promise<boolean> {
    const { data, error } = await supabase.rpc("insert_comment", {
      p_case_id,
      p_text,
      p_user_id,
    });
    if (error){
      console.error(error);
      return false;
    } 
    return true;
  }
}

export const caseService = new CaseService();
