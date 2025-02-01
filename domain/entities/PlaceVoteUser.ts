export interface PlaceVoteUser {
  id: number;
  place_id: number;
  user_id: string; // UUID 값
  created_at: string; // timestamps 값이므로 string으로 사용
}
