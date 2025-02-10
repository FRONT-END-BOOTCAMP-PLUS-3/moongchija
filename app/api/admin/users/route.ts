import { DfGetAllUsersUsecase } from "@/application/usecases/user/DfGetAllUsersUsecase";
import { NextResponse } from "next/server";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { UserListDto } from "@/application/usecases/user/dto/UserListDto";

// ✅ GET: 전체 유저 목록 조회 (검색 기능 제거)
export const GET = async () => {
  try {
    const userRepo = new SbUserRepository();
    const getAllUsersUseCase = new DfGetAllUsersUsecase(userRepo);
    const users: UserListDto[] = await getAllUsersUseCase.execute();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
