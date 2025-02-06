import { UserRepository } from "@/domain/repositories/UserRepository";
import { UserDeleteDto } from "./dto/UserDeleteDto";

export class DfDeleteUserUsecase {
  constructor(private userRepo: UserRepository) {}

  async execute(deleteDto: UserDeleteDto): Promise<void> {
    const { userId } = deleteDto;

    if (!userId) {
      throw new Error("유저 ID가 제공되지 않았습니다.");
    }

    await this.userRepo.deleteUser(userId);
  }
}
