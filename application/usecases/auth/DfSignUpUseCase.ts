import { UserEmojiRepository } from "@/domain/repositories/UserEmojiRepository";
import { UserRepository } from "@/domain/repositories/UserRepository";

export class DfSignUpUsecase {
  constructor(
    private userRepository: UserRepository,
    private UserEmojiRepository: UserEmojiRepository
  ) {}

  async execute(user_email: string, hashedPassword: string, nickname: string) {
    const existingUser = await this.userRepository.findUserByEmail(user_email);
    if (existingUser) {
      throw new Error("이미 사용중인 이메일 입니다.");
    }

    const uniqueNickname = await this.userRepository.generateUniqueNickname(
      nickname
    );

    const emoji = await this.UserEmojiRepository.createUserRandomEmoji();

    const provider = "email";

    const userWithToken = await this.userRepository.createUser(
      user_email,
      hashedPassword,
      uniqueNickname,
      emoji,
      provider
    );

    return userWithToken;
  }
}
