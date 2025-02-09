import { User } from "../entities/User";

export interface UserRepository {
  createUser(
    user_email: string,
    nickname: string,
    emoji: string,
    provider: string,
    type: string,
    kakao_id?: number,
    password?: string
  ): Promise<User & { access_token: string }>;
  findById(id: string): Promise<User>;
  findByKakaoId(
    kakao_id: number
  ): Promise<Omit<User, "password" | "created_at"> | null>;
  findByIds(id: string[]): Promise<User[]>;
  findUserByEmail(user_email: string): Promise<Omit<User, "password"> | null>;
  findUserByNickname(nickname: string): Promise<boolean>;
  generateUniqueNickname(baseNickname: string): Promise<string>;
  getNicknamesByUserIds(userIds: string[]): Promise<
    {
      user_id: string;
      nickname: string;
    }[]
  >;
  createUserRandomEmoji(): Promise<string>;
  findAllEmojis(): Promise<{ id: number; src: string; alt: string }[]>;
  updateUserInfo(
    userId: string,
    updateData: { nickname?: string; emoji?: string }
  ): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(userId: string): Promise<boolean>;
}
