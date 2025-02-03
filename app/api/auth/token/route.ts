import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value || null;

  return NextResponse.json({ token });
}
