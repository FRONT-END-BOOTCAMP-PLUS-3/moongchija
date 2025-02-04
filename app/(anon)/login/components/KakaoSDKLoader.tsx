import { useEffect } from "react";

export default function KakaoSDKLoader() {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Kakao) {
      const script = document.createElement("script");
      script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js";
      script.async = true;
      script.onload = () => {
        if (window.Kakao) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!);
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
