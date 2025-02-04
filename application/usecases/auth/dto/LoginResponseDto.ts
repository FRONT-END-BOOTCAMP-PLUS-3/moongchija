export interface LoginResponseDto {
  userId: string;
  user: {
    id: string;
    user_email: string;
    nickname: string;
    emoji: string;
  };
}
