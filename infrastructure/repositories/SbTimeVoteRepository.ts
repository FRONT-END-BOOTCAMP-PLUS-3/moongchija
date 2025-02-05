import { createClient } from "@/utils/supabase/server";
import { TimeVoteRepository } from "@/domain/repositories/TimeVoteRepository";
import { TimeVote } from "@/domain/entities/TimeVote";

export class SbTimeVoteRepository implements TimeVoteRepository {
  async createTimeVotes(
    appointmentId: number,
    times: string[]
  ): Promise<number[]> {
    const supabase = await createClient();

    const newTimeVotes = times.map((time) => ({
      appointment_id: appointmentId,
      time: time,
    }));

    const { data, error } = await supabase
      .from("time_vote")
      .insert(newTimeVotes)
      .select("id"); // ✅ 새로 생성된 ID 반환

    if (error) {
      throw new Error(`Failed to insert time votes: ${error.message}`);
    }
    return data?.map((item) => item.id) || [];
  }

  async getTimeVotesByAppointment(appointmentId: number): Promise<TimeVote[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("time_vote")
      .select("*")
      .eq("appointment_id", appointmentId);

    if (error) {
      throw new Error(`Failed to fetch time votes: ${error.message}`);
    }

    return data || [];
  }
  async findTimeIdByTimestamp(
    appointmentId: number,
    time: string
  ): Promise<number | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("time_vote")
      .select("id")
      .eq("appointment_id", appointmentId)
      .eq("time", time)
      .single();

    if (error) {
      return null;
    }
    return data?.id || null;
  }
}
