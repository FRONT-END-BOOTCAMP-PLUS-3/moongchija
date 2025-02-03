// import { Auth } from "@/domain/entities/Auth";
import { AuthRepository } from "@/domain/repositories/AuthRepository";
import { createClient } from "@/utils/supabase/server";
import { SbUserRepository } from "./SbUserRepository";
import { SbUserEmojiRepository } from "./SbUserEmojiRepository";
import { User } from "@/domain/entities/User";

import { generateJwtToken } from "@/utils/auth/auth-utils";
import { comparePassword } from "@/utils/auth/comparePassword";

export class SbAuthRepository implements AuthRepository {
  async signIn(
    user_email: string,
    password: string
  ): Promise<Omit<User, "password"> & { access_token: string }> {
    const userRepository = new SbUserRepository();

    const userData = await userRepository.findUserByEmail(user_email);

    if (!userData) {
      throw new Error(
        "로그인 실패: 이메일이 존재하지 않거나 오류가 발생했습니다."
      );
    }

    const isPasswordValid = await comparePassword(password, userData.password);
    if (!isPasswordValid) {
      throw new Error("로그인 실패: 비밀번호가 일치하지 않습니다.");
    }

    const token = generateJwtToken(
      userData.id,
      userData.user_email,
      userData.nickname,
      userData.emoji
    );

    return {
      id: userData.id,
      user_email: userData.user_email,
      nickname: userData.nickname,
      emoji: userData.emoji,
      created_at: userData.created_at,
      provider: userData.provider,
      access_token: token,
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
        console.error("세션 오류:", error);
        throw new Error("카카오 로그인 처리 중 오류가 발생했습니다.");
      }

      const email = session.user?.email;

      if (!email) {
        throw new Error("카카오 사용자 이메일을 가져오는 데 실패했습니다.");
      }

      let existingUser = await userRepository.findUserByEmail(email);

      if (existingUser) {
        if (!existingUser.nickname || !existingUser.emoji) {
          const nickname = email.split("@")[0];
          const uniqueNickname = await userRepository.generateUniqueNickname(
            nickname
          );
          const randomEmoji = await userEmojiRepository.createUserRandomEmoji();

          const updatedUser = await userRepository.updateUser(existingUser.id, {
            nickname: uniqueNickname,
            emoji: randomEmoji,
          });
          existingUser = updatedUser;
        }
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
