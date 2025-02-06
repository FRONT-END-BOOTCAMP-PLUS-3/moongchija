import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";

export class DfUpdateEmojiUsecase {
  constructor(private userRepository: SbUserRepository) {}

  async execute(userId: string, updateData: { emoji: string }) {
    const userInfo = await this.userRepository.updateUserInfo(
      userId,
      updateData
    );

    return userInfo;
  }
}
