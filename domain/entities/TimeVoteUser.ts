export interface TimeVoteUser {
  id: number;
  time_id: number;
  user_id: string;
  created_at: string; // timestamps 값이므로 string으로 사용
}
