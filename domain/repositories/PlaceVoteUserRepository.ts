export interface PlaceVoteUserRepository {
  voteForPlace(
    userId: string,
    placeId: number,
    memberId: number
  ): Promise<void>; // 특정약속의 특정장소에 투표추가
  getUsersByPlace(
    placeId: number
  ): Promise<{ user_id: string; nickname: string }[]>; // 특정 장소에 투표한 유저 목록 조회
}
