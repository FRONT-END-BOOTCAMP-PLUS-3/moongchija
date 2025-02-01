import { createClient } from "@/utils/supabase/server";
import { PlaceVoteUserRepository } from "@/domain/repositories/PlaceVoteUserRepository";
import { PlaceVoteUser } from "@/domain/entities/PlaceVoteUser";

export class SbPlaceVoteUserRepository implements PlaceVoteUserRepository {
  async voteForPlace(userId: string, placeId: number): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from("place_vote_user").insert({
      place_id: placeId,
      user_id: userId,
    });

    if (error) {
      throw new Error(`Failed to vote for place: ${error.message}`);
    }
  }

  async getUsersByPlace(placeId: number): Promise<PlaceVoteUser[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("place_vote_user")
      .select("*")
      .eq("place_id", placeId);

    if (error) {
      throw new Error(`Failed to fetch users for place: ${error.message}`);
    }

    return data || [];
  }
}
