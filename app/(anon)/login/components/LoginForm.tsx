"use client";

import InputField from "@/components/input-filed/InputFiled";
import styles from "./LoginForm.module.scss";
import Button from "@/components/button/Button";
import useInput from "../../signup/hooks/useInput";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const { value: email, onChange: handleChangeEmail } = useInput("");
  const { value: password, onChange: handleChabgePassword } = useInput("");
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
        throw new Error(error || "로그인에 실패했습니다.");
      }

      const { token } = await response.json(); // 서버에서 JWT 토큰을 받음
      localStorage.setItem("token", token); // JWT를 localStorage에 저장
      console.log("로그인 성공!");
      router.push("/user/appointments");
    } catch (error) {
      console.log(error);
    }
  };
  return (
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
        onChange={handleChabgePassword}
        placeholder="비밀번호를 입력해주세요"
      />
      <Button text="로그인" size="lg" />
    </form>
  );
};

export default LoginForm;
