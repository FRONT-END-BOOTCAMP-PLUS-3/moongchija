import { AuthRepository } from "@/domain/repositories/AuthRepository";
import { SbUserRepository } from "./SbUserRepository";
import { User } from "@/domain/entities/User";

import { generateJwtToken } from "@/utils/auth/auth-utils";
import { comparePassword } from "@/utils/auth/comparePassword";

export class SbAuthRepository implements AuthRepository {
  async signIn(
    user_email: string,
    password: string
  ): Promise<Omit<User, "password"> & { userId: string }> {
    const userRepository = new SbUserRepository();

    const userData = await userRepository.findUserByEmail(user_email);

    if (!userData) {
      throw new Error("유효하지 않은 이메일 또는 비밀번호입니다.");
    }

    const isPasswordValid = await comparePassword(password, userData.password);

    if (!isPasswordValid) {
      throw new Error("로그인 실패: 비밀번호가 일치하지 않음");
    }

    const userId = generateJwtToken(
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
      userId: userId,
    };
  }
}
