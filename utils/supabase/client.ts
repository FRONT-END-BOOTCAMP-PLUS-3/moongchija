import { jwtDecode } from "jwt-decode"; // ✅ JWT 디코딩 라이브러리

export async function getUserIdClient(): Promise<string | null> {
  try {
    // ✅ 서버에서 token 가져오기
    const response = await fetch("/api/auth/token");
    if (!response.ok) throw new Error("❌ 서버에서 token 가져오기 실패");

    const { token } = await response.json();
    if (!token) {
      console.warn("⚠️ `token` 값이 없음");
      return null;
    }

    // ✅ JWT 토큰 디코딩
    const decoded: any = jwtDecode(token);
    if (!decoded?.sub) {
      console.warn("❌ JWT 토큰에서 `userId` 찾을 수 없음");
      return null;
    }
    return decoded.sub;
  } catch (error) {
    console.error("❌ getUserIdClient 오류 발생:", error);
    return null;
  }
}
