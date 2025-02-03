// export function parseSupabaseCookie(cookieValue: string): any | null {
//   try {
//     if (!cookieValue) {
//       console.warn("❌ 쿠키 값이 없음");
//       return null;
//     }

//     console.log("📜 원본 쿠키 값:", cookieValue);

//     // ✅ "base64-" 접두사 제거
//     if (cookieValue.startsWith("base64-")) {
//       cookieValue = cookieValue.replace("base64-", "");
//     }

//     console.log("📜 Base64 제거 후 값:", cookieValue);

//     // ✅ Base64 문자열인지 검증
//     if (cookieValue.length % 4 !== 0 || /[^A-Za-z0-9+/=]/.test(cookieValue)) {
//       console.warn("❌ Base64 형식이 아님:", cookieValue);
//       return null;
//     }

//     // ✅ Base64 디코딩 시도 (오류 감지)
//     let decoded;
//     try {
//       decoded = atob(cookieValue);
//     } catch (error) {
//       console.error("❌ Base64 디코딩 실패:", error);
//       return null;
//     }

//     console.log("✅ Base64 디코딩된 값:", decoded);

//     // ✅ JSON 형식 검증 후 파싱
//     try {
//       const parsed = JSON.parse(decoded);
//       return parsed;
//     } catch (error) {
//       console.error("❌ JSON 파싱 실패:", error);
//       return null;
//     }
//   } catch (error) {
//     console.error("❌ 쿠키 파싱 과정에서 예기치 않은 오류 발생:", error);
//     return null;
//   }
// }
