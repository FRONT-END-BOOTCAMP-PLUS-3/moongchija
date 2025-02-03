import { SocialLoginUseCase } from "@/application/usecases/auth/SocialLoginUseCase";
import { SbAuthRepository } from "@/infrastructure/repositories/SbAuthRepository";
import { jwtDecode } from "jwt-decode";

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

    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);

      const userId = decodedToken.sub;

      const response = NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/user/appointments`
      );

      if (userId) {
        response.cookies.set("userId", userId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // 배포 환경에서만 secure 설정
          sameSite: "strict",
          maxAge: 60 * 60,
        });
      }

      return response;
    } else {
      return NextResponse.json(
        { error: "Access Token is missing or invalid" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("카카오 로그인 오류:", error);

    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
