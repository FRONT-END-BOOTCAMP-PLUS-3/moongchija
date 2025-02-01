import { TimeVote } from "../entities/TimeVote";

export interface TimeVoteRepository {
  createTimeVotes(appointmentId: number, times: string[]): Promise<void>; // createTimeVotes → 특정 약속(appointment_id)의 가능한 시간을 생성
  getTimeVotesByAppointment(appointmentId: number): Promise<TimeVote[]>; // 특정 약속의 모든 시간 투표 조회
}
