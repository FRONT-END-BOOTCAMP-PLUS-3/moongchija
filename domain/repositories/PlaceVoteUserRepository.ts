import { PlaceVoteUser } from "../entities/PlaceVoteUser";

export interface PlaceVoteUserRepository {
  voteForPlace(userId: string, placeId: number): Promise<void>; // 특정 장소에 대한 투표 추가
  getUsersByPlace(placeId: number): Promise<PlaceVoteUser[]>; // 특정 장소에 투표한 유저 목록 조회
}
