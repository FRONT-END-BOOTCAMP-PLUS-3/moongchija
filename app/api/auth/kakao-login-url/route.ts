import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId = process.env.KAKAO_CLIENT_ID!;
    const redirectUri = process.env.KAKAO_REDIRECT_URI!;
    const encodedRedirectUri = encodeURIComponent(redirectUri);

    const loginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}`;
    return NextResponse.json({ loginUrl });
  } catch (error) {
    return NextResponse.error(error);
  }
}
