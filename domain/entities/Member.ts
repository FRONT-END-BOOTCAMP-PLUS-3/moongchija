export interface Member {
  id: number; // 멤버 ID (Primary Key)
  appointment_id: number; // 약속 id (FK)
  user_id: string; // 멤버 유저 id(FK)
  created_at: Date;
}
