import { UserEmojiRepository } from "@/domain/repositories/UserEmojiRepository";
import { UserRepository } from "@/domain/repositories/UserRepository";

export class SignUpUsecase {
  constructor(
    private userRepository: UserRepository,
    private UserEmojiRepository: UserEmojiRepository
  ) {}

  async execute(user_email: string, password: string, nickname: string) {
    const existingUser = await this.userRepository.findUserByEmail(user_email);
    if (existingUser) {
      throw new Error("이미 사용중인 이메일 입니다.");
    }

    const emoji = await this.UserEmojiRepository.createUserRandomEmoji();

    const userWithToken = await this.userRepository.createUser(
      user_email,
      password,
      nickname,
      emoji
    );

    return userWithToken;
  }
}
