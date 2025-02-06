import { UserRepository } from "@/domain/repositories/UserRepository";
import { UserListDto } from "./dto/UserListDto";

export class DfGetAllUsersUsecase {
  constructor(private userRepo: UserRepository) {}

  // ✅ 검색 필터링 제거
  async execute(): Promise<UserListDto[]> {
    const users = await this.userRepo.getAllUsers();

    // ✅ UseCase에서 DTO 변환
    return users.map((user) => ({
      id: user.id,
      user_email: user.user_email,
      nickname: user.nickname,
      created_at: new Date(user.created_at),
    }));
  }
}
