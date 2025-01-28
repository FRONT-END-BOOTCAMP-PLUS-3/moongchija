import { LoginUsecase } from "@/application/usecases/auth/LoginUsecase";
import { SbAuthRepository } from "@/infrastructure/repositories/SbAuthRepository";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { user_email, password } = await request.json();

    const authRepository = new SbAuthRepository();
    const loginUsecase = new LoginUsecase(authRepository);

    const { token, user } = await loginUsecase.execute(user_email, password);
    return NextResponse.json({ user, token }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("로그인 실패: " + error.message);
    }

    throw new Error("알 수 없는 에러가 발생했습니다.");
  }
};
