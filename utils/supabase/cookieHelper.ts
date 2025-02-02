export const parseSupabaseCookie = (cookieValue: string | undefined) => {
  if (!cookieValue) return null;

  try {
    const decoded = decodeURIComponent(cookieValue); // ✅ base64 디코딩
    return JSON.parse(decoded); // ✅ JSON 파싱
  } catch (error) {
    console.error("❌ 쿠키 파싱 오류:", error);
    return null;
  }
};
