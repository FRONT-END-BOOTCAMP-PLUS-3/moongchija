import { LoginUsecase } from "@/application/usecases/auth/LoginUsecase";
import { SbAuthRepository } from "@/infrastructure/repositories/SbAuthRepository";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { user_email, password } = await request.json();

    const authRepository = new SbAuthRepository();
    const loginUsecase = new LoginUsecase(authRepository);

    const { token, user } = await loginUsecase.execute(user_email, password);

    const response = NextResponse.json({ user }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 배포 환경에서만 secure 설정
      sameSite: "strict",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("로그인 실패: " + error.message);
    }

    throw new Error("알 수 없는 에러가 발생했습니다.");
  }
};
