import { AuthRepository } from "@/domain/repositories/AuthRepository";
import { LoginResponseDto } from "./dto/LoginResponseDTO";

export class DfLoginUsecase {
  constructor(private authRepository: AuthRepository) {}

  async execute(
    user_email: string,
    password: string
  ): Promise<LoginResponseDto> {
    try {
      const { token, ...user } =
        await this.authRepository.signInWithEmailPassword(user_email, password);

      return { token, user };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error("로그인 실패: " + error.message);
      }

      throw new Error("알 수 없는 에러가 발생했습니다.");
    }
  }
}
