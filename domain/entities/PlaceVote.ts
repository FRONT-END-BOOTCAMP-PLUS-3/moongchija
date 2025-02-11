export interface PlaceVote {
  id?: number;
  appointment_id: number | null;
  place: string;
  place_url?: string;
  created_at?: string; // timestamps 값이므로 string으로 사용
}
