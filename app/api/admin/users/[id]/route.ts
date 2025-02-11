import { NextRequest, NextResponse } from "next/server";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { DfDeleteUserUsecase } from "@/application/usecases/user/DfDeleteUserUsecase";

// ✅ DELETE: 유저 삭제
export const DELETE = async (request: NextRequest) => {
  try {
    const urlParts = request.nextUrl.pathname.split("/");
    const userId = urlParts[urlParts.length - 1];

    if (!userId) {
      return NextResponse.json(
        { error: "유저 ID가 없습니다." },
        { status: 400 }
      );
    }

    // ✅ 유즈케이스를 통해 유저 삭제 실행
    const userRepository = new SbUserRepository();
    const deleteUserUsecase = new DfDeleteUserUsecase(userRepository);
    const isDeleted = await deleteUserUsecase.execute({ userId: userId });

    if (!isDeleted) {
      return NextResponse.json({ error: "유저 삭제 실패" }, { status: 404 });
    }

    return NextResponse.json({ message: "유저가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("❌ 유저 삭제 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
};
