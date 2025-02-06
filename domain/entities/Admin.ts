export interface Admin {
  id?: number; // 어드민 ID (Primary Key)
  nickname?: string; // 어드민유저의 닉네임
  password?: string; // 패스워드
  created_at?: string; // 생성 날짜
}
