import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { UpdateEmojiDto } from "./dto/UpdateEmojiDto";

export class DfUpdateEmojiUsecase {
  constructor(private userRepository: SbUserRepository) {}

  async execute(
    userId: string,
    updateData: { emoji: string }
  ): Promise<UpdateEmojiDto> {
    const userInfo = await this.userRepository.updateUserInfo(
      userId,
      updateData
    );

    return userInfo;
  }
}
