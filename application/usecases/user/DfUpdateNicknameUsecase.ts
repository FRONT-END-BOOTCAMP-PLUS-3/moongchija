import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";

export class DfUpdateNicknameUsecase {
  constructor(private userRepository: SbUserRepository) {}

  async execute(userId: string, updateData: { nickname: string }) {
    const userInfo = await this.userRepository.updateUserInfo(
      userId,
      updateData
    );

    return userInfo;
  }
}
