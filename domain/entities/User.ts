export interface User {
  id: string;
  user_email: string;
  password: string | "";
  nickname: string;
  emoji: string;
  created_at: Date;
  provider: string;
  kakao_id?: number;
}
