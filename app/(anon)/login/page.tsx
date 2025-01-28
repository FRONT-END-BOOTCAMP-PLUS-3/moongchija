"use client";

import Image from "next/image";
import styles from "./login.module.scss";
import LoginForm from "./components/LoginForm";
import LogoWithTitle from "./components/LogoWithTitle";
import Link from "next/link";

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

      <div className={styles.signupInfo}>
        <p>계정이 없으신가요?</p>
        <Link href={"/signup"}>계정 생성</Link>
      </div>
    </div>
  );
};

export default LoginPage;
