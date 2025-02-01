import { createClient } from "@/utils/supabase/server";
import { Appointment } from "@/domain/entities/Appointment";
import { SupabaseClient } from "@supabase/supabase-js";
import { AppointmentRepository } from "@/domain/repositories/AppointmentRepository";

export class SbAppointmentRepository implements AppointmentRepository {
  private async getClient(): Promise<SupabaseClient> {
    return await createClient();
  }

  async create(appointment: Appointment): Promise<Appointment[]> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("appointment")
      .insert([appointment])
      .select();

    if (error) {
      throw new Error(`약속 생성 실패: ${error.message}`);
    }
    return data || [];
  }

  async findById(appointmentId: number): Promise<Appointment | null> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("appointment")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (error) {
      return null;
    }
    return data;
  }

  async findByOwner(ownerId: string): Promise<Appointment[]> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("appointment")
      .select("*")
      .eq("owner_id", ownerId);

    if (error) {
      throw new Error(`소유자 약속 조회 실패: ${error.message}`);
    }
    return data || [];
  }

  async updateStatus(appointmentId: number, status: string): Promise<void> {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from("appointment")
      .update({ status })
      .eq("id", appointmentId);

    if (error) {
      throw new Error(`약속 상태 업데이트 실패: ${error.message}`);
    }
  }

  async confirm(
    appointmentId: number,
    confirmTime: string,
    confirmPlace: string,
    confirmPlaceUrl: string
  ): Promise<void> {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from("appointment")
      .update({
        confirm_time: confirmTime,
        confirm_place: confirmPlace,
        confirm_place_url: confirmPlaceUrl,
      })
      .eq("id", appointmentId);

    if (error) {
      throw new Error(`약속 확정 실패: ${error.message}`);
    }
  }

  async delete(appointmentId: number): Promise<void> {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from("appointment")
      .delete()
      .eq("id", appointmentId);

    if (error) {
      throw new Error(`약속 삭제 실패: ${error.message}`);
    }
  }
}
