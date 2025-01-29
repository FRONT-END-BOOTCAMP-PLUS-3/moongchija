import { Auth } from "@/domain/entities/Auth";
import { AuthRepository } from "@/domain/repositories/AuthRepository";
import { createClient } from "@/utils/supabase/server";

export class SbAuthRepository implements AuthRepository {
  async signInWithEmailPassword(
    user_email: string,
    password: string
  ): Promise<Auth> {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: user_email,
      password,
    });

    if (error) {
      throw new Error("로그인 실패: " + error.message);
    }

    const user = data.user;
    const session = data.session;

    return {
      id: user?.id,
      user_email: user.email!,
      nickname: user?.user_metadata?.nickname,
      emoji: user?.user_metadata?.emoji,
      token: session?.access_token,
    };
  }

  async signOut(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
}
