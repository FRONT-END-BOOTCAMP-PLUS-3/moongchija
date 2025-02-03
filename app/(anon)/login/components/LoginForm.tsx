"use client";

import InputField from "@/components/input-filed/InputFiled";
import styles from "./LoginForm.module.scss";
import Button from "@/components/button/Button";
import useInput from "../../signup/hooks/useInput";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginForm = () => {
  const { value: email, onChange: handleChangeEmail } = useInput("");
  const {
    value: password,
    setValue: setPassword,
    onChange: handleChangePassword,
  } = useInput("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email: email, password: password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setErrorMessage(error);
        setPassword("");
        return;
      }

      router.push("/user/appointments");
    } catch (error) {
      console.log(error);
    }
  };

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
        <Button text="로그인" size="lg" />
      </form>
    </>
  );
};

export default LoginForm;
