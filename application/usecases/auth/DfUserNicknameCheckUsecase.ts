import { UserRepository } from "@/domain/repositories/UserRepository";
import { UserNicknameCheckResponseDto } from "./dto/UserNicknameCheckResponseDto";

export class DfUserNicknameCheckUsecase {
  constructor(private userRepository: UserRepository) {}

  async excute(nickname: string): Promise<UserNicknameCheckResponseDto> {
    const existingNickname = await this.userRepository.findUserByNickname(
      nickname
    );

    return { isAvailable: !existingNickname };
  }
}
