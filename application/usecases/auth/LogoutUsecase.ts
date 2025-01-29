import { AuthRepository } from "@/domain/repositories/AuthRepository";

export class LogoutUsecase {
  constructor(private authRepository: AuthRepository) {}

  async execute() {
    try {
      await this.authRepository.signOut();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error("로그아웃 실패: " + error.message);
      }

      throw new Error("알 수 없는 에러가 발생했습니다.");
    }
  }
}
