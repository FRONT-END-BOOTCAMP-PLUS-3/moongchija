export interface User {
  id: string;
  user_email: string;
  password: string | "";
  nickname: string;
  emoji: string;
  created_at: Date;
  provider: string;
  type?: string;
  kakao_id?: number;
}
