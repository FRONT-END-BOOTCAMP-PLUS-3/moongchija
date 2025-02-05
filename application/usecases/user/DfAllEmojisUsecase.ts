import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";

export class DfAllEmojisUsecase {
  constructor(private userRepository: SbUserRepository) {}

  async execute() {
    const emojis = await this.userRepository.findAllEmojis();

    return emojis;
  }
}
