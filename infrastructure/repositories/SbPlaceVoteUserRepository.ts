import { createClient } from "@/utils/supabase/server";
import { PlaceVoteUserRepository } from "@/domain/repositories/PlaceVoteUserRepository";

export class SbPlaceVoteUserRepository implements PlaceVoteUserRepository {
  async voteForPlace(
    userId: string,
    placeId: number,
    memberId: number
  ): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from("place_vote_user").insert({
      place_id: placeId,
      user_id: userId,
      member_id: memberId,
    });

    if (error) {
      console.log(
        `📌 [DEBUG] place_id 저장 실패 (userId: ${userId}, placeId: ${placeId}):`,
        error
      );
      throw new Error(`Failed to vote for place: ${error.message}`);
    }
  }

  async getUsersByPlace(
    placeId: number
  ): Promise<{ user_id: string; nickname: string }[]> {
    const supabase = await createClient();

    // ✅ 1. 해당 장소에 투표한 사용자 목록(user_id만 가져옴)
    const { data: users, error } = await supabase
      .from("place_vote_user")
      .select("user_id")
      .eq("place_id", placeId);

    if (error) {
      throw new Error(`Failed to fetch users for place: ${error.message}`);
    }

    if (!users || users.length === 0) return [];

    // ✅ 2. user 테이블에서 해당 user_id의 nickname 조회 (⚠️ `user_id` → `id` 수정)
    const userIds = users.map((user) => user.user_id);
    const { data: userNicknames, error: userError } = await supabase
      .from("user")
      .select("id, nickname") // ✅ `user_id` → `id`
      .in("id", userIds); // ✅ `id` 기반으로 조회

    if (userError) {
      throw new Error(`Failed to fetch user nicknames: ${userError.message}`);
    }

    // ✅ 3. user_id를 기반으로 nickname 매칭하여 반환
    return users.map((user) => ({
      user_id: user.user_id,
      nickname:
        userNicknames.find((u) => u.id === user.user_id)?.nickname || "Unknown", // ✅ `id` 기반으로 매칭
    }));
  }
}
