import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { UpdateUserNicknameDto } from "./dto/UpdateUserNicknameDto";

export class DfUpdateNicknameUsecase {
  constructor(private userRepository: SbUserRepository) {}

  async execute(
    userId: string,
    updateData: { nickname: string }
  ): Promise<UpdateUserNicknameDto> {
    const userInfo = await this.userRepository.updateUserInfo(
      userId,
      updateData
    );

    return userInfo;
  }
}
