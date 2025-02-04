import { User } from "../entities/User";

export interface UserRepository {
  createUser(
    user_email: string,
    password: string,
    nickname: string,
    emoji: string,
    provider: string
  ): Promise<User & { access_token: string }>;
  findById(id: string): Promise<User>;
  findByIds(id: string[]): Promise<User[]>;
  findUserByEmail(user_email: string): Promise<Omit<User, "password"> | null>;
  findUserByNickname(nickname: string): Promise<boolean>;
  generateUniqueNickname(baseNickname: string): Promise<string>;
  updateUser(
    userId: string,
    updateData: { nickname?: string; emoji?: string }
  ): Promise<User>;
}
