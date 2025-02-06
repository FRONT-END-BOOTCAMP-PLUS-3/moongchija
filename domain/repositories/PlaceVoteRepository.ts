import { PlaceVote } from "../entities/PlaceVote";

export interface PlaceVoteRepository {
  create(placeVotes: PlaceVote | PlaceVote[]): Promise<void>;
  
  // 특정 약속(appointment_id)에 장소 추가
  addPlace(
    appointmentId: number,
    place: string,
    placeUrl?: string
  ): Promise<void>;
  getPlacesByAppointment(appointmentId: number): Promise<PlaceVote[]>; // 특정 약속(appointment_id)에 등록된 장소 목록 조회
}
