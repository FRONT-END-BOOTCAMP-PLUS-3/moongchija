import { createClient } from "@/utils/supabase/server";
import { Appointment } from "@/domain/entities/Appointment";
import { SupabaseClient } from "@supabase/supabase-js";
import { AppointmentRepository } from "@/domain/repositories/AppointmentRepository";
import { Member } from "@/domain/entities/Member";

export class SbAppointmentRepository implements AppointmentRepository {
  async findByIds(appointmentIds: number[]): Promise<Appointment[] | null> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("appointment")
      .select("*")
      .in("id", appointmentIds);

    if (error) {
      console.error("Error fetching appointments by IDs:", error.message);
      return null;
    }
    return data || null;
  }

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

  async getAppointmentTime(
    appointmentId: number
  ): Promise<Partial<Appointment> | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appointment")
      .select("id, start_time, end_time")
      .eq("id", appointmentId)
      .single();

    if (error) {
      console.error("Error fetching appointment time:", error.message);
      return null;
    }

    return data
      ? { id: data.id, start_time: data.start_time, end_time: data.end_time }
      : null;
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

  async getMembersByAppointment(
    appointmentId: number
  ): Promise<(Member & { nickname: string })[]> {
    const supabase = await createClient();

    // ✅ 1. member 테이블에서 user_id 목록 가져오기
    const { data: members, error: memberError } = await supabase
      .from("member")
      .select("id, appointment_id, user_id, created_at")
      .eq("appointment_id", appointmentId);

    if (memberError) {
      throw new Error(`Failed to fetch members: ${memberError.message}`);
    }

    if (!members || members.length === 0) return [];

    // ✅ 2. user 테이블에서 user_id에 해당하는 nickname 가져오기
    const userIds = members.map((member) => member.user_id);
    const { data: users, error: userError } = await supabase
      .from("user") // ✅ user 테이블에서 조회
      .select("id, nickname")
      .in("id", userIds);

    if (userError) {
      throw new Error(`Failed to fetch user nicknames: ${userError.message}`);
    }

    // ✅ 3. user_id를 기반으로 nickname 매칭하여 반환 (Member의 모든 속성 유지)
    return members.map((member) => ({
      id: member.id, // ✅ Member 타입 필수 속성 추가
      appointment_id: member.appointment_id, // ✅ Member 타입 필수 속성 추가
      user_id: member.user_id, // ✅ Member 타입 필수 속성 추가
      created_at: member.created_at, // ✅ Member 타입 필수 속성 추가
      nickname:
        users.find((u) => u.id === member.user_id)?.nickname || "Unknown", // ✅ nickname 추가
    }));
  }

  async confirmAppointment(
    appointmentId: number,
    confirmData: {
      confirm_time: string;
      confirm_place: string;
      confirm_place_url: string;
      status: string;
    }
  ): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("appointment")
      .update(confirmData)
      .eq("id", appointmentId);

    if (error) {
      throw new Error(`Failed to confirm appointment: ${error.message}`);
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
