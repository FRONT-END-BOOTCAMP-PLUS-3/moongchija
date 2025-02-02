import { Auth } from "../entities/Auth";
import { User } from "../entities/User";

export interface AuthRepository {
  signInWithEmailPassword(user_email: string, password: string): Promise<Auth>;
  signOut(): Promise<void>;
  getKakaoLoginUrl(): Promise<string>;
  handleKakaoLogin(
    code: string
  ): Promise<Omit<User, "password"> & { access_token: string }>;
}
