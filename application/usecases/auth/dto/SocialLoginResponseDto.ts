export interface SocialLoginResponseDto {
  id: string;
  user_email: string;
  nickname: string;
  emoji: string;
  provider: string;
  kakao_id?: number;
  access_token: string | null;
}
