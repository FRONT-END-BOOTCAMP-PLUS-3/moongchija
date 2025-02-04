import { DfLoginUsecase } from "@/application/usecases/auth/DfLoginUsecase";
import { SbAuthRepository } from "@/infrastructure/repositories/SbAuthRepository";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { user_email, password } = await request.json();

    if (!user_email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const authRepository = new SbAuthRepository();
    const loginUsecase = new DfLoginUsecase(authRepository);

    const { token } = await loginUsecase.execute(user_email, password);

    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/user/appointments`;
    const response = NextResponse.json({
      redirectUrl,
    });

    response.cookies.set("userId", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("Invalid login credentials")
    ) {
      return NextResponse.json(
        { error: "유효하지 않은 이메일 또는 비밀번호입니다." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "알 수 없는 에러가 발생했습니다." },
      { status: 500 }
    );
  }
};
