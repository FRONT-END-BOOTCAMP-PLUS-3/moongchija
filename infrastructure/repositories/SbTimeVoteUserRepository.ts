import { createClient } from "@/utils/supabase/server";
import { TimeVoteUserRepository } from "@/domain/repositories/TimeVoteUserRepository";
import { TimeVoteUser } from "@/domain/entities/TimeVoteUser";

export class SbTimeVoteUserRepository implements TimeVoteUserRepository {
  async voteForTime(userId: string, timeId: number): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from("time_vote_user").insert({
      time_id: timeId,
      user_id: userId,
    });

    if (error) {
      throw new Error(`Failed to vote for time: ${error.message}`);
    }
  }

  async getUsersByTime(timeId: number): Promise<TimeVoteUser[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("time_vote_user")
      .select("*")
      .eq("time_id", timeId);

    if (error) {
      throw new Error(`Failed to fetch users for time: ${error.message}`);
    }

    return data || [];
  }
}
