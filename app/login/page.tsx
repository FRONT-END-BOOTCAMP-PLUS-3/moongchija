"use client";

import Image from "next/image";
import styles from "./login.module.scss";
import LoginForm from "./_components/LoginForm";
import LogoWithTitle from "./_components/LogoWithTitle";

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <LogoWithTitle />
      <LoginForm />
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
    </div>
  );
};

export default LoginPage;
