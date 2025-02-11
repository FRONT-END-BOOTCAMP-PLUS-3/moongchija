import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { NoticeRepository } from "@/domain/repositories/NoticeRepository";
import { Notice } from "@/domain/entities/Notice";

export class SbNoticeRepository implements NoticeRepository {
  private async getClient(): Promise<SupabaseClient> {
    return await createClient();
  }

  async create(descript: string, appointmentId: number): Promise<void> {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from("notice")
      .insert([{ descript, appointment_id: appointmentId }]);

    if (error) {
      throw new Error(`공지사항 생성 실패: ${error.message}`);
    }
  }

  async findById(appointmentId: number): Promise<Notice[] | null> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("notice")
      .select("*")
      .eq("appointment_id", appointmentId);

    if (error) {
      console.log("공지사항 조회 실패:", error.message);
      return null;
    }

    return data || null;
  }

  async update(noticeId: number, descript: string): Promise<void> {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from("notice")
      .update({ descript })
      .eq("id", noticeId);
      

    if (error) {
      console.log(`공지사항 수정 실패: ${error.message}`);
  throw new Error(`공지사항 수정 실패: ${error.message}`);

    }
  }

  async delete(noticeId: number): Promise<void> {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from("notice")
      .delete()
      .eq("id", noticeId);

    if (error) {
      throw new Error(`공지사항 삭제 실패: ${error.message}`);
    }
  }
}
