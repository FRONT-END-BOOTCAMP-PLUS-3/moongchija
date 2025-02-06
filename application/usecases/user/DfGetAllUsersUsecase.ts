import { UserRepository } from "@/domain/repositories/UserRepository";
import { UserListDto } from "./dto/UserListDto";

export class DfGetAllUsersUsecase {
  constructor(private userRepo: UserRepository) {}

  async execute(filter: string, value: string): Promise<UserListDto[]> {
    const users = await this.userRepo.getAllUsers(filter, value);

    // ✅ UseCase에서 DTO 변환
    return users.map((user) => ({
      id: user.id,
      user_email: user.user_email,
      nickname: user.nickname,
      created_at: new Date(user.created_at),
    }));
  }
}
