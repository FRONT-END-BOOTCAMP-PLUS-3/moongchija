import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { GetUserTypeDto } from "./dto/GetUserTypeDto";

export class DfGetUserTypeUsecase {
  constructor(private userRepository: SbUserRepository) {}

  async execute(userId: string): Promise<GetUserTypeDto> {
    const userInfo = await this.userRepository.findById(userId);

    return { type: userInfo.type };
  }
}
