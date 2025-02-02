import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { parseSupabaseCookie } from "./cookie";

export const supabase = createClientComponentClient();

function getCookie(name: string) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return null;
}

// ✅ 로그인한 유저 ID 가져오는 함수
export async function getUserIdClient(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      console.log("✅ Supabase에서 직접 가져온 유저 ID:", data.user.id);
      return data.user.id;
    }

    if (error) console.warn("⚠️ Supabase에서 유저 정보 가져오기 실패:", error);

    // ✅ Fallback: 쿠키에서 userId 가져오기
    const authCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sb-"))
      ?.split("=")[1];

    if (!authCookie) {
      console.warn("❌ Supabase 인증 쿠키 없음");
      return null;
    }

    const parsed = parseSupabaseCookie(authCookie);
    if (!parsed || typeof parsed !== "object") {
      console.warn("❌ 쿠키에서 유효한 JSON 데이터를 찾을 수 없음");
      return null;
    }

    if (!parsed?.sub) {
      console.warn("❌ Supabase 쿠키에서 userId 찾을 수 없음");
      return null;
    }

    console.log("✅ 쿠키에서 가져온 userId:", parsed.sub);
    return parsed.sub;
  } catch (error) {
    console.error("❌ getUserIdClient 오류 발생:", error);
    return null;
  }
}
