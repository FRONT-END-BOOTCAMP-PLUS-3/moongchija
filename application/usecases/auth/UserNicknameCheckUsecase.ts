import { UserRepository } from "@/domain/repositories/UserRepository";

export class UserNicknameCheckUsecase {
  constructor(private userRepository: UserRepository) {}

  async excute(nickname: string) {
    const existingNickname = await this.userRepository.findUserByNickname(
      nickname
    );

    return { isAvailable: !existingNickname };
  }
}
