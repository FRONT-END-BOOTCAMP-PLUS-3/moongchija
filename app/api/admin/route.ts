import { DfGetUserTypeUsecase } from "@/application/usecases/user/DfGetUserTypeUsecase";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const cookieStore = cookies();
    const userId = (await cookieStore).get("userId")?.value || null;

    if (!userId) {
      return NextResponse.json(
        { error: "userId가 없습니다. 로그인해주세요." },
        { status: 401 }
      );
    }
    const userRepository = new SbUserRepository();
    const getUserTypeUsecase = new DfGetUserTypeUsecase(userRepository);

    const userInfo = await getUserTypeUsecase.execute(userId);
    if (!userInfo) {
      return NextResponse.json(
        { error: "유저 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ userInfo });
  } catch (error) {
    console.log("❌ /api/admin GET 요청 오류:", error);

    return NextResponse.json(
      { error: "서버 내부에 오류가 생겼습니다." },
      { status: 500 }
    );
  }
};
