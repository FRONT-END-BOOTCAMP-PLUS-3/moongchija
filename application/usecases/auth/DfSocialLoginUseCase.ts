import { SbAuthRepository } from "@/infrastructure/repositories/SbAuthRepository";

export class DfSocialLoginUseCase {
  constructor(private authRepository: SbAuthRepository) {}

  async execute(provider: string, code: string) {
    if (provider === "kakao") {
      try {
        const { access_token } = await this.authRepository.handleKakaoLogin(
          code
        );

        return access_token;
      } catch (error) {
        console.error("소셜 로그인 실패:", error);
        throw new Error("카카오 로그인 중 문제가 발생했습니다.");
      }
    }
  }
}
