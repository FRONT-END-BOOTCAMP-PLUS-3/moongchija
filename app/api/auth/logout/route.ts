import { LogoutUsecase } from "@/application/usecases/auth/LogoutUsecase";
import { SbAuthRepository } from "@/infrastructure/repositories/SbAuthRepository";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const authRepository = new SbAuthRepository();
    const logoutUsecase = new LogoutUsecase(authRepository);

    await logoutUsecase.execute();

    const response = NextResponse.json({ message: "로그아웃 성공" });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "알 수 없는 에러가 발생했습니다." },
      { status: 500 }
    );
  }
};
