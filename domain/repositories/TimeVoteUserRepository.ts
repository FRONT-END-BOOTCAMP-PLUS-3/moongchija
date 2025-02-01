import { TimeVoteUser } from "../entities/TimeVoteUser";

export interface TimeVoteUserRepository {
  voteForTime(userId: string, timeId: number): Promise<void>; // 특정 시간에 대한 투표 추가
  getUsersByTime(timeId: number): Promise<TimeVoteUser[]>; // 특정 시간에 투표한 유저 목록 조회
}
