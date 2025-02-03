import { DfSignUpUsecase } from "@/application/usecases/auth/DfSignUpUseCase";

import { SbUserEmojiRepository } from "@/infrastructure/repositories/SbUserEmojiRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { user_email, password, nickname } = await request.json();

    const userRepository = new SbUserRepository();
    const userEmojiRepository = new SbUserEmojiRepository();
    const signupUsecase = new DfSignUpUsecase(
      userRepository,
      userEmojiRepository
    );

    const userWithToken = await signupUsecase.execute(
      user_email,
      password,
      nickname
    );

    return NextResponse.json(userWithToken);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in signup:", error.message);
      const errorMessage =
        error.message === "User already registered"
          ? "이미 가입된 사용자입니다."
          : error.message;

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "알 수 없는 오류 발생" },
        { status: 400 }
      );
    }
  }
};
