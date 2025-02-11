export interface TimeVote {
  id: number;
  appointment_id: number;
  time: string; // timestamp 값이므로 string으로 사용
  created_at: string; // timestamps 값이므로 string으로 사용
}
