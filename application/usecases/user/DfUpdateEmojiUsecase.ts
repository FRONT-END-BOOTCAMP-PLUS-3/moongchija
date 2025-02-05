import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";

export class DfUpdateEmojiUsecase {
  constructor(private userRepository: SbUserRepository) {}

  async execute(
    userId: string,
    updateData: { nickname?: string; emoji?: string }
  ) {
    const userInfo = await this.userRepository.updateUserInfo(
      userId,
      updateData
    );

    return userInfo;
  }
}
