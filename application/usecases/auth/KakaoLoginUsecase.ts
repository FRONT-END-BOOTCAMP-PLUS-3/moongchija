import { SignUpUsecase } from "./SignUpUseCase";
import { LoginUsecase } from "./LoginUsecase";

export class KakaoLoginUsecase {
  constructor(
    private signUpUsecase: SignUpUsecase,
    private loginUsecase: LoginUsecase
  ) {}

  async execute(email: string, nickname: string) {
    try {
      await this.signUpUsecase.execute(email, "defaulPassword", nickname);

      const userData = await this.loginUsecase.execute(
        email,
        "defaultPassword"
      );

      return userData;
    } catch (error) {
      console.log(error);
    }
  }
}
