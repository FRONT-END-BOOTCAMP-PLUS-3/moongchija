import { DfLoginUsecase } from "@/application/usecases/auth/DfLoginUsecase";
import { SbAuthRepository } from "@/infrastructure/repositories/SbAuthRepository";
import { jwtDecode } from "jwt-decode";
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

    const { token, user } = await loginUsecase.execute(user_email, password);

    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;

      const response = NextResponse.json({ user }, { status: 200 });

      if (userId) {
        response.cookies.set("userId", userId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // 배포 환경에서만 secure 설정
          sameSite: "strict",
          maxAge: 60 * 60,
        });
      }

      return response;
    }
  } catch (error: unknown) {
    console.error("로그인 오류:", error);
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
