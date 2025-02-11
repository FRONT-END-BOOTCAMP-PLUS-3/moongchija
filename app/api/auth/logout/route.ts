import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const redirectUrl = `${process.env.SITE_URL}`;

    const response = NextResponse.json({
      redirectUrl,
    });

    response.headers.set(
      "Set-Cookie",
      "userId=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
    );

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "알 수 없는 에러가 발생했습니다." },
      { status: 500 }
    );
  }
};
