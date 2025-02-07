export interface CreateUserResponseDto {
  id: string;
  user_email: string;
  nickname: string;
  emoji: string;
  created_at: Date;
  access_token: string;
  provider: string;
  kakao_id?: number;
}
