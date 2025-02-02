import { SocialLoginUseCase } from "@/application/usecases/auth/SocialLoginUseCase";
import { SbAuthRepository } from "@/infrastructure/repositories/SbAuthRepository";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        {
          error: "카카오 인증 코드가 없습니다.",
        },
        { status: 400 }
      );
    }

    const authRepository = new SbAuthRepository();
    const socialLoginUseCase = new SocialLoginUseCase(authRepository);

    const accessToken = await socialLoginUseCase.execute(
      "kakao",
      code as string
    );

    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/user/appointments`
    );

    response.headers.set(
      "Set-Cookie",
      `token=${accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`
    );

    return response;
  } catch (error) {
    console.error("카카오 로그인 오류:", error);

    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
