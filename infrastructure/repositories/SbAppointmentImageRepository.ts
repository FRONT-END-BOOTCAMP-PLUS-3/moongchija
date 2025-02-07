import { AppointmentImage } from "@/domain/entities/AppointmentImage";
import { AppointmentImageRepository } from "@/domain/repositories/AppointmentImageRepository";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export class SbAppointmentImageRepository implements AppointmentImageRepository {
  private async getClient(): Promise<SupabaseClient> {
    return await createClient();
  }

  // 전체 이미지 조회
  async getAllImages(): Promise<AppointmentImage[]> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("appointment_image")
      .select("id, appointment_id, image_url, creater_id, created_at");

    if (error) {
      throw new Error("이미지 목록 조회 실패");
    }

    return (data || []).map((image) => ({
      id: image.id,
      appointment_id: image.appointment_id,
      image_url: image.image_url,
      creater_id: image.creater_id,
      created_at: new Date(image.created_at),
    }));
  }

  // 특정 약속의 이미지 조회
  async getImagesByAppointmentId(appointmentId: number): Promise<AppointmentImage[]> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("appointment_image")
      .select("id, appointment_id, image_url, creater_id, created_at")
      .eq("appointment_id", appointmentId);

    if (error) {
      throw new Error("특정 약속 이미지 조회 실패: " + error.message);
    }

    return (data || []).map((image) => ({
      id: image.id,
      appointment_id: image.appointment_id,
      image_url: image.image_url,
      creater_id: image.creater_id,
      created_at: new Date(image.created_at),
    }));
  }

  // 이미지 삭제 (기존 코드 유지)
  async deleteImage(imageId: string): Promise<boolean> {
    const supabase = await this.getClient();

    const { data: imageData, error: fetchError } = await supabase
      .from("appointment_image")
      .select("image_url")
      .eq("id", imageId)
      .single();

    if (fetchError || !imageData) {
      console.error("❌ 이미지 정보를 찾을 수 없음:", fetchError?.message);
      return false;
    }

    const imageUrl = imageData.image_url;
    const filePath = imageUrl.replace(
      "https://yswjnlalguzoxdcmydxr.supabase.co/storage/v1/object/public/images/",
      ""
    );

    const { error: storageError } = await supabase.storage
      .from("images")
      .remove([filePath]);

    if (storageError) {
      console.error("❌ 스토리지에서 이미지 삭제 실패:", storageError.message);
      return false;
    } else {
      const { error: deleteError } = await supabase
        .from("appointment_image")
        .delete()
        .eq("id", imageId);

      if (deleteError) {
        console.error("❌ DB에서 이미지 삭제 실패:", deleteError.message);
        return false;
      }
    }
    return true;
  }
}
