export interface LoginResponseDto {
  token: string;
  user: {
    id: string;
    user_email: string;
    nickname: string;
    emoji: string;
  };
}
