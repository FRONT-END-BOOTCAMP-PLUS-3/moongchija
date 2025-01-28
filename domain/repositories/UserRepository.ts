import { User } from "../entities/User";

export interface UserRepository {
  createUser(
    user_email: string,
    password: string,
    nickname: string,
    emoji: string
  ): Promise<Omit<User, "password">>;
  findUserByEmail(user_email: string): Promise<Omit<User, "password"> | null>;
}
