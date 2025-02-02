import { Auth } from "@/domain/entities/Auth";
import { AuthRepository } from "@/domain/repositories/AuthRepository";
import { createClient } from "@/utils/supabase/server";
import { SbUserRepository } from "./SbUserRepository";
import { SbUserEmojiRepository } from "./SbUserEmojiRepository";
import { User } from "@/domain/entities/User";

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

  async getKakaoLoginUrl(): Promise<string> {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      },
    });

    if (error || !data.url) {
      throw new Error("카카오 로그인 URL을 가져오는 데 실패했습니다.");
    }

    return data.url;
  }

  async handleKakaoLogin(
    code: string
  ): Promise<Omit<User, "password"> & { access_token: string }> {
    const supabase = await createClient();
    const userRepository = new SbUserRepository();
    const userEmojiRepository = new SbUserEmojiRepository();

    try {
      const { data: session, error } =
        await supabase.auth.exchangeCodeForSession(code);

      if (error || !session) {
        throw new Error("카카오 로그인 처리 중 오류가 발생했습니다.");
      }

      const email = session.user?.email;

      if (!email) {
        throw new Error("카카오 사용자 이메일을 가져오는 데 실패했습니다.");
      }

      let existingUser = await userRepository.findUserByEmail(email);

      if (existingUser) {
        const nickname = email.split("@")[0];
        const uniqueNickname = await userRepository.generateUniqueNickname(
          nickname
        );
        const randomEmoji = await userEmojiRepository.createUserRandomEmoji();

        console.log("업데이트할 정보:", {
          userId: existingUser.id,
          nickname: uniqueNickname,
          emoji: randomEmoji,
        });
        const updatedUser = await userRepository.updateUser(existingUser.id, {
          nickname: uniqueNickname,
          emoji: randomEmoji,
        });
        existingUser = updatedUser;
      } else {
        throw new Error("❌ 기존 사용자 정보를 찾을 수 없습니다.");
      }

      return {
        id: existingUser.id,
        user_email: existingUser.user_email,
        nickname: existingUser.nickname,
        emoji: existingUser.emoji,
        created_at: existingUser.created_at,
        access_token: session.session.access_token,
      };
    } catch (error) {
      console.error("카카오 로그인 처리 중 오류:", error);
      throw new Error("카카오 로그인 중 오류가 발생했습니다.");
    }
  }
}
