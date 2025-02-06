import { DfDeleteUserUsecase } from "@/application/usecases/user/DfDeleteUserUsecase";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const DELETE = async () => {
  try {
    const cookieStore = cookies();
    const userId = (await cookieStore).get("userId")?.value || null;

    if (!userId) {
      return NextResponse.json(
        { error: "유저 ID가 없습니다." },
        { status: 400 }
      );
    }

    const userRepository = new SbUserRepository();
    const deleteUserUsecase = new DfDeleteUserUsecase(userRepository);
    const isDeleted = await deleteUserUsecase.execute({ userId });

    if (!isDeleted) {
      return NextResponse.json({ error: "유저 삭제 실패" }, { status: 404 });
    }

    const redirectUrl = `${process.env.SITE_URL}`;

    const response = NextResponse.json({
      redirectUrl,
    });

    response.headers.set(
      "Set-Cookie",
      "userId=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
    );

    return response;
  } catch {
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
};
