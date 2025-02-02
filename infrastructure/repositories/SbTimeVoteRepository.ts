import { createClient } from "@/utils/supabase/server";
import { TimeVoteRepository } from "@/domain/repositories/TimeVoteRepository";
import { TimeVote } from "@/domain/entities/TimeVote";

export class SbTimeVoteRepository implements TimeVoteRepository {
  async createTimeVotes(appointmentId: number, times: string[]): Promise<void> {
    const supabase = await createClient();

    const newTimeVotes = times.map((time) => ({
      appointment_id: appointmentId,
      time: time,
    }));

    const { error } = await supabase.from("time_vote").insert(newTimeVotes);

    if (error) {
      throw new Error(`Failed to insert time votes: ${error.message}`);
    }
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
      .single(); // ✅ 단일 결과 조회

    if (error) {
      console.error(`Error finding time_id for ${time}:`, error);
      return null;
    }

    return data?.id || null;
  }
}
