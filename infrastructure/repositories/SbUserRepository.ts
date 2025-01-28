import { User } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { createClient } from "@/utils/supabase/server";

export class SbUserRepository implements UserRepository {
  async createUser(
    user_email: string,
    password: string,
    nickname: string,
    emoji: string
  ): Promise<Omit<User, "password">> {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user_email,
      password,
      options: {
        data: {
          nickname,
          emoji,
        },
      },
    });

    if (authError) {
      console.log("AuthError :", authError);

      throw authError;
    }

    return {
      id: authData.user!.id,
      user_email: user_email,
      nickname: nickname,
      emoji: emoji,
      created_at: new Date(),
    };
  }

  async findUserByEmail(
    user_email: string
  ): Promise<Omit<User, "password"> | null> {
    const supabase = await createClient();
    const { data: user, error } = await supabase
      .from("user")
      .select()
      .eq("user_email", user_email)
      .single();

    if (error) return null;
    if (!user) return null;

    return {
      id: user.id,
      user_email: user.user_email,
      nickname: user.nickname,
      emoji: user.emoji,
      created_at: new Date(user.created_at),
    };
  }

  async findUserByNickname(nickname: string): Promise<boolean> {
    const supabase = await createClient();
    const { data: user } = await supabase
      .from("user")
      .select("id")
      .eq("nickname", nickname)
      .single();

    return !!user;
  }
}
