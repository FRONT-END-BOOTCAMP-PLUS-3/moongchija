export interface TimeVoteDto {
  time(appointmentId: number, time: any): unknown;
  timeId: number; // ✅ time_vote 테이블의 id
}
