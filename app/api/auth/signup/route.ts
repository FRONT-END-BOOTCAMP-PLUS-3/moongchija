import { SignUpUsecase } from "@/application/usecases/auth/SignUpUsecase";
import { SbUserEmojiRepository } from "@/infrastructure/repositories/SbUserEmojiRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { user_email, password, nickname } = await request.json();

    const userRepository = new SbUserRepository();
    const userEmojiRepository = new SbUserEmojiRepository();
    const signupUsecase = new SignUpUsecase(
      userRepository,
      userEmojiRepository
    );

    const user = await signupUsecase.execute(user_email, password, nickname);

    return NextResponse.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in signup:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "알 수 없는 오류 발생" },
        { status: 400 }
      );
    }
  }
};
