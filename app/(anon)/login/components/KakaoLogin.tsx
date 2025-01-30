"use client";

import styles from "./KakaoLogin.module.scss";
import Image from "next/image";

const KakaoLogin = () => {
  const handleGetKakaoLoginUrl = async () => {
    try {
      const response = await fetch("api/auth/kakao-login-url");
      const { loginUrl } = await response.json();
      if (loginUrl) {
        window.location.href = loginUrl;
      } else {
        console.error("로그인 URL이 없습니다.");
      }
    } catch (error) {
      console.error("카카오 로그인 URL 요청 실패:", error);
    }
  };

  return (
    <div className={styles["kakaoLoginContainer"]}>
      <button
        className={styles["kakaoLoginBtn"]}
        onClick={handleGetKakaoLoginUrl}
      >
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
