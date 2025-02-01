import { createClient } from "@/utils/supabase/server";
import { PlaceVoteRepository } from "@/domain/repositories/PlaceVoteRepository";
import { PlaceVote } from "@/domain/entities/PlaceVote";

export class SbPlaceVoteRepository implements PlaceVoteRepository {
  async addPlace(
    appointmentId: number,
    place: string,
    placeUrl?: string
  ): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from("place_vote").insert({
      appointment_id: appointmentId,
      place: place,
      place_url: placeUrl || null,
    });

    if (error) {
      throw new Error(`Failed to insert place vote: ${error.message}`);
    }
  }

  async getPlacesByAppointment(appointmentId: number): Promise<PlaceVote[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("place_vote")
      .select("*")
      .eq("appointment_id", appointmentId);

    if (error) {
      throw new Error(
        `Failed to fetch places for appointment: ${error.message}`
      );
    }

    return data || [];
  }
}
