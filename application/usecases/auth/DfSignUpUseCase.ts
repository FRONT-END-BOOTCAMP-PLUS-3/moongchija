import { UserRepository } from "@/domain/repositories/UserRepository";
import { CreateUserResponseDto } from "./dto/CreateUserResponseDto";

export class DfSignUpUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    user_email: string,
    hashedPassword: string,
    nickname: string
  ): Promise<CreateUserResponseDto> {
    const existingUser = await this.userRepository.findUserByEmail(user_email);
    if (existingUser) {
      throw new Error("이미 사용중인 이메일 입니다.");
    }

    const uniqueNickname = await this.userRepository.generateUniqueNickname(
      nickname
    );

    const emoji = await this.userRepository.createUserRandomEmoji();

    const provider = "email";

    const userWithToken = await this.userRepository.createUser(
      user_email,
      uniqueNickname,
      emoji,
      provider,
      undefined,
      hashedPassword
    );

    return userWithToken;
  }
}
