import { Camera, CameraResultType, Photo } from "@capacitor/camera";
import { supabase } from "./supabase-service";

class CameraService {

  async takePhoto(): Promise<Photo>{
    const getPhoto = await Camera.getPhoto({
      quality: 75,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });


    return getPhoto;
  }

  async uploadPhoto(image: File, caseId: string): Promise<boolean>{
    const { data, error } = await supabase.storage
      .from("media")
      .upload(`case-${caseId}/${image.name}`, image)
      if(error){
        console.error(error);
        return false;
      }
      return true;
  }
}

export const cameraService = new CameraService();
