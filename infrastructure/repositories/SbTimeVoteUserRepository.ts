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

  async getUsersByTime(
    timeId: number
  ): Promise<(TimeVoteUser & { nickname: string })[]> {
    const supabase = await createClient();

    // ✅ 1. time_vote_user 테이블에서 필요한 속성 포함하여 user_id 목록 가져오기
    const { data: users, error: userError } = await supabase
      .from("time_vote_user")
      .select("id, time_id, user_id, created_at") // ✅ 필요한 속성 추가
      .eq("time_id", timeId);

    if (userError) {
      throw new Error(`Failed to fetch users for time: ${userError.message}`);
    }

    if (!users || users.length === 0) return [];

    // ✅ 2. user 테이블에서 user_id에 해당하는 nickname 가져오기 (⚠️ `user_id` → `id` 수정)
    const userIds = users.map((user) => user.user_id);
    const { data: userDetails, error: nicknameError } = await supabase
      .from("user") // ✅ `user_id` 대신 `id` 사용
      .select("id, nickname") // ✅ `user_id` → `id`
      .in("id", userIds); // ✅ `id` 기반으로 조회

    if (nicknameError) {
      throw new Error(
        `Failed to fetch user nicknames: ${nicknameError.message}`
      );
    }

    // ✅ 3. user_id를 기반으로 nickname 매칭하여 반환 (TimeVoteUser 타입 유지)
    return users.map((user) => ({
      id: user.id, // ✅ TimeVoteUser 속성 유지
      time_id: user.time_id, // ✅ TimeVoteUser 속성 유지
      user_id: user.user_id, // ✅ TimeVoteUser 속성 유지
      created_at: user.created_at, // ✅ TimeVoteUser 속성 유지
      nickname:
        userDetails.find((u) => u.id === user.user_id)?.nickname || "Unknown", // ✅ nickname 추가
    }));
  }
}
