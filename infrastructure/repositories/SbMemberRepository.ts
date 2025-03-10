import { Member } from "@/domain/entities/Member";
import { MemberRepository } from "@/domain/repositories/MemberRepository";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export class SbMemberRepository implements MemberRepository {
  private async getClient(): Promise<SupabaseClient> {
    return await createClient();
  }

  async addMemberToAppointment(
    userId: string,
    appointmentId: number
  ): Promise<void> {
    const supabase = await createClient();

    // ✅ 이미 멤버인지 확인 (중복 삽입 방지)
    const isMember = await this.isUserInAppointment(userId, appointmentId);
    if (isMember) return;

    const { error } = await supabase.from("member").insert({
      user_id: userId,
      appointment_id: appointmentId,
    });

    if (error) {
      console.log(`📌 [DEBUG] member 추가 실패:`, error);
      throw new Error(`Failed to add member to appointment: ${error.message}`);
    }
  }

  async isUserInAppointment(
    userId: string,
    appointmentId: number
  ): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("member")
      .select("id")
      .eq("user_id", userId)
      .eq("appointment_id", appointmentId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.log(`📌 [DEBUG] member 조회 실패:`, error);
      throw new Error(
        `Failed to check appointment membership: ${error.message}`
      );
    }

    return !!data; // ✅ 존재하면 true, 없으면 false 반환
  }

  async findByAppointmentId(appointment_id: number): Promise<Member[]> {
    const client = await this.getClient();
    const { data, error } = await client
      .from("member")
      .select()
      .eq("appointment_id", appointment_id);
    if (error) {
      throw new Error(
        `Error finding member by appointment ID: ${error.message}`
      );
    }
    return data;
  }

  async findByUserId(userId: string): Promise<Member[]> {
    const client = await this.getClient();
    const { data, error } = await client
      .from("member")
      .select()
      .eq("user_id", userId);
    if (error) {
      throw new Error(`Error finding member by user ID: ${error.message}`);
    }
    return data;
  }

  async getMemberStatus(
    userId: string,
    appointmentId: number
  ): Promise<{ id: number; is_vote: boolean } | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("member")
      .select("id, is_vote")
      .eq("user_id", userId)
      .eq("appointment_id", appointmentId)
      .single();

    if (error) {
      console.log("❌ [DEBUG] 멤버 상태 조회 실패:", error);
      return null;
    }

    return data;
  }

  async updateVoteStatus(
    userId: string,
    appointmentId: number,
    isVote: boolean
  ): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("member")
      .update({ is_vote: isVote })
      .eq("user_id", userId)
      .eq("appointment_id", appointmentId);

    if (error) {
      console.log("❌ [DEBUG] 투표 상태 업데이트 실패:", error);
      throw new Error(`Failed to update vote status: ${error.message}`);
    }
  }

  async getVotedMemberIdsByAppointment(
    appointmentId: number
  ): Promise<string[]> {
    const supabase = await this.getClient();

    const { data, error } = await supabase
      .from("member")
      .select("user_id")
      .eq("appointment_id", appointmentId)
      .eq("is_vote", true);

    if (error) {
      throw new Error(`투표 완료한 멤버 조회 실패: ${error.message}`);
    }

    return data ? data.map((member) => member.user_id) : [];
  }

  async deleteMember(userId: string, appointmentId: number): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("member")
      .delete()
      .eq("user_id", userId)
      .eq("appointment_id", appointmentId);

    if (error) {
      console.log(`member 삭제 실패:`, error);
      throw new Error(`Failed to delete member: ${error.message}`);
    }
  }
}
