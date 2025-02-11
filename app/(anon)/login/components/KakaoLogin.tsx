"use client";

import styles from "./KakaoLogin.module.scss";
import Image from "next/image";
import KakaoSDKLoader from "./KakaoSDKLoader";

const KakaoLogin = () => {
  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      console.error("❌ Kakao SDK가 로드되지 않았습니다.");
      return;
    }

    window.Kakao.Auth.authorize({
      redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
    });
  };

  return (
    <div className={styles["kakaoLoginContainer"]}>
      <KakaoSDKLoader />
      <button className={styles["kakaoLoginBtn"]} onClick={handleKakaoLogin}>
        <Image
          src={"/images/logos/kakao-logo.svg"}
          alt="카카오 로고"
          width={50}
          height={50}
          className={styles["kakaoLogo"]}
        />
        카카오 로그인
      </button>
    </div>
  );
};

export default KakaoLogin;
