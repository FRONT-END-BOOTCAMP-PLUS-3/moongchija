// import { Auth } from "../entities/Auth";
import { User } from "../entities/User";

export interface AuthRepository {
  signIn(
    user_email: string,
    password: string
  ): Promise<Omit<User, "password"> & { access_token: string }>;
  getKakaoLoginUrl(): Promise<string>;
  handleKakaoLogin(
    code: string
  ): Promise<Omit<User, "password"> & { access_token: string }>;
}
