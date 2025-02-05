export interface TimeVoteDto {
  time(appointmentId: number, time: any): unknown;
  timeId: number; // ✅ time_vote 테이블의 id
}

export interface PlaceVoteDto {
  placeId: number; // ✅ place_vote 테이블의 id
}

export interface VoteSubmissionDto {
  userId: string; // ✅ 투표하는 사용자 ID
  appointmentId: number; // ✅ 추가됨! (약속 ID)
  timeVotes: TimeVoteDto[]; // ✅ 사용자가 선택한 시간 투표 목록
  placeVotes: PlaceVoteDto[]; // ✅ 사용자가 선택한 장소 투표 목록
}
