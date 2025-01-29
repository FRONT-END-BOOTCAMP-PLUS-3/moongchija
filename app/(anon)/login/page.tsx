"use client";

import styles from "./login.module.scss";
import LoginForm from "./components/LoginForm";
import LogoWithTitle from "./components/LogoWithTitle";
import Link from "next/link";
import KakaoLogin from "./components/KakaoLogin";

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <LogoWithTitle />
      <LoginForm />
      <KakaoLogin />
      <div className={styles.signupInfo}>
        <p>계정이 없으신가요?</p>
        <Link href={"/signup"}>계정 생성</Link>
      </div>
    </div>
  );
};

export default LoginPage;
