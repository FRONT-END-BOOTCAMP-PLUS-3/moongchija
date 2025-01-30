import { LoginUsecase } from "@/application/usecases/auth/LoginUsecase";
import { SignUpUsecase } from "@/application/usecases/auth/SignUpUseCase";
import { SbAuthRepository } from "@/infrastructure/repositories/SbAuthRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { NextResponse } from "next/server";
import { KakaoLoginUsecase } from "@/application/usecases/auth/KakaoLoginUsecase";
import { SbUserEmojiRepository } from "@/infrastructure/repositories/SbUserEmojiRepository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 }
    );
  }

  const clientId = process.env.KAKAO_CLIENT_ID!;
  const clientSecret = process.env.KAKAO_CLIENT_SECRET!;
  const redirectUri = process.env.KAKAO_REDIRECT_URI!;

  try {
    const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      console.error(
        "Failed to fetch access token:",
        await tokenResponse.text()
      );

      return NextResponse.json(
        { error: "Failed to fetch access token" },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 400 }
      );
    }

    // access_token을 사용하여 카카오 API에서 사용자 정보 가져오기
    const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();

    const { email } = userData.kakao_account || {};
    const nickname = email.split("@")[0];
    if (!email) {
      return NextResponse.json(
        { error: "Failed to fetch user email" },
        { status: 400 }
      );
    }

    const userRepository = new SbUserRepository();
    const userEmojiRepository = new SbUserEmojiRepository();
    const authRepository = new SbAuthRepository();
    const signupUsecase = new SignUpUsecase(
      userRepository,
      userEmojiRepository
    );
    const loginUsecase = new LoginUsecase(authRepository);

    const kakaoLoginUsecase = new KakaoLoginUsecase(
      signupUsecase,
      loginUsecase
    );

    // 카카오 로그인 후 이메일로 유저가 없다면 회원가입 진행
    try {
      const newUser = await kakaoLoginUsecase.execute(email, nickname);
      // 테스트 용 나중에 삭제
      //  process.env.NODE_ENV !== "production"  배포할때는 이렇게
      const isLocalhost =
        process.env.NODE_ENV !== "production" ||
        new URL(request.url).hostname === "localhost";
      const response = NextResponse.redirect(
        "http://localhost:3000/user/appointments"
      );
      response.cookies.set("token", accessToken, {
        httpOnly: true,
        secure: isLocalhost,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error during Kakao OAuth process:", error);
    return NextResponse.json(
      { error: "Error during Kakao OAuth process" },
      { status: 500 }
    );
  }
}
