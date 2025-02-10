"use client";

import InputField from "@/components/input-filed/InputFiled";
import styles from "./LoginForm.module.scss";
import Button from "@/components/button/Button";
// import useInput from "../../signup/hooks/useInput";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
import useLogin from "../hooks/useLogin";

const LoginForm = () => {
  const {
    email,
    password,
    handleChangeEmail,
    handleChangePassword,
    errorMessage,
    isLoading,
    handleSubmit,
  } = useLogin();

  return (
    <>
      <form className={styles.formBox} onSubmit={handleSubmit}>
        <InputField
          type="email"
          label="이메일"
          value={email}
          onChange={handleChangeEmail}
          placeholder="이메일을 입력해주세요"
        />
        <InputField
          type="password"
          label="비밀번호"
          value={password}
          onChange={handleChangePassword}
          placeholder="비밀번호를 입력해주세요"
        />
        <p className={styles.loginErrorMessage}>{errorMessage}</p>

        <Button text={isLoading ? "로그인 중..." : "로그인"} size="lg" />
      </form>
    </>
  );
};

export default LoginForm;
