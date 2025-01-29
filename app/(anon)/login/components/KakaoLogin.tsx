"use client";

import styles from "./KakaoLogin.module.scss";
import Image from "next/image";

const KakaoLogin = () => {
  return (
    <div className={styles["kakaoLoginContainer"]}>
      <button className={styles["kakaoLoginBtn"]}>
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
