import { User } from "../entities/User";

export interface AuthRepository {
  signIn(
    user_email: string,
    password: string
  ): Promise<Omit<User, "password"> & { token: string }>;
}
