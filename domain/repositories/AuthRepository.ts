import { Auth } from "../entities/Auth";

export interface AuthRepository {
  signInWithEmailPassword(user_email: string, password: string): Promise<Auth>;
  signOut(): Promise<void>;
}
