import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { EmojiListDto } from "./dto/EmojiListDto";

export class DfGetAllEmojisUsecase {
  constructor(private userRepository: SbUserRepository) {}

  async execute(): Promise<EmojiListDto[]> {
    const emojis = await this.userRepository.findAllEmojis();

    return emojis;
  }
}
