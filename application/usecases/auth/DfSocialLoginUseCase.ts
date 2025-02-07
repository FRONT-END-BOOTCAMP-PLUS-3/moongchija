import { generateJwtToken } from "@/utils/auth/auth-utils";

import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { SocialLoginResponseDto } from "./dto/SocialLoginResponseDto";
interface KakaoUserInfo {
  id: number;
  kakao_account: {
    email: string;
  };
}
export class DfSocialLoginUseCase {
  constructor(private userRepository: SbUserRepository) {}

  async execute(userInfo: KakaoUserInfo): Promise<SocialLoginResponseDto> {
    const kakao_id = userInfo.id;
    const user_email = userInfo.kakao_account?.email;
    const nickname = user_email.split("@")[0];
    const emoji = await this.userRepository.createUserRandomEmoji();
    const uniqueNickname = await this.userRepository.generateUniqueNickname(
      nickname
    );

    const existingUser = await this.userRepository.findByKakaoId(kakao_id);

    let user;
    if (!existingUser) {
      user = await this.userRepository.createUser(
        user_email,
        uniqueNickname,
        emoji,
        "kakao",
        kakao_id
      );
    } else {
      user = existingUser;
    }
    const token = generateJwtToken(
      user.id,
      user.user_email,
      user.nickname,
      user.emoji
    );

    return {
      id: user.id,
      user_email: user.user_email,
      nickname: user.nickname,
      emoji: user.emoji,
      provider: user.provider,
      kakao_id: user.kakao_id,
      access_token: token,
    };
  }
}
