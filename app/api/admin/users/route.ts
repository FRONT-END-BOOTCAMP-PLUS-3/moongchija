import { DfGetAllUsersUsecase } from "@/application/usecases/user/DfGetAllUsersUsecase";
import { NextRequest, NextResponse } from "next/server";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { UserListDto } from "@/application/usecases/user/dto/UserListDto";

// ✅ GET: 유저 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "";
    const value = searchParams.get("value") || "";

    const userRepo = new SbUserRepository();
    const getAllUsersUseCase = new DfGetAllUsersUsecase(userRepo);
    const users: UserListDto[] = await getAllUsersUseCase.execute(
      filter,
      value
    );

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
}
