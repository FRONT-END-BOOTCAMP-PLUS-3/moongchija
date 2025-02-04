import { NextRequest, NextResponse } from "next/server";
import { getKakaoUserInfo } from "../kakao-user/route";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { DfSocialLoginUseCase } from "@/application/usecases/auth/DfSocialLoginUseCase";
import { SbUserEmojiRepository } from "@/infrastructure/repositories/SbUserEmojiRepository";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "인가 코드 없음" },
        { status: 400 }
      );
    }

    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID!, // REST API 키
        redirect_uri: process.env.KAKAO_REDIRECT_URI!, // 콜백 URL
        code: code, // 인가 코드
        client_secret: process.env.KAKAO_CLIENT_SECRET!, // (옵션) 보안 강화를 위한 secret key
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return NextResponse.json(
        { success: false, message: "토큰 요청 실패", error: tokenData },
        { status: 400 }
      );
    }

    const accessToken = tokenData.access_token;

    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const userData = await userRes.json();
    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, message: "사용자 정보 요청 실패", error: userData },
        { status: 400 }
      );
    }

    const userInfo = await getKakaoUserInfo(tokenData.access_token);

    const userRepository = new SbUserRepository();
    const emojiRepository = new SbUserEmojiRepository();
    const socialLoginUsecase = new DfSocialLoginUseCase(
      emojiRepository,
      userRepository
    );

    const user = await socialLoginUsecase.execute(userInfo);

    const userId = user.access_token;

    const redirectUrl = `${process.env.SITE_URL}/user/appointments`;
    const response = NextResponse.redirect(redirectUrl);

    if (userId) {
      response.cookies.set("userId", userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60,
      });
    }
    return response;
  } catch (error) {
    console.error("카카오 로그인 오류:", error);

    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
