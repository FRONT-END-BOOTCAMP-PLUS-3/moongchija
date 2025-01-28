"use client";
import Button from "@/components/button/Button";
import InputField from "@/components/input-filed/InputFiled";
import styles from "./AuthForm.module.scss";

import EmailInputField from "./EmailInputField";
import useForm from "../hooks/useForm";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [nicknameCheckError, setNicknameCheckError] = useState<string | null>(
    null
  );
  const [nicknameCheckSuccess, setNicknameCheckSuccess] = useState<
    string | null
  >(null);

  const router = useRouter();

  const {
    email: { email, emailError, handleChangeEmail },
    nickname: {
      nickname,
      nicknameError,
      handleChangeNickname,
      setIsNicknameAvailable,
    },
    password: { password, passwordError, habdleChangePassword },
    passwordCheck: {
      passwordCheck,
      passwordCheckError,
      habdleChangePasswordCheck,
    },
    isFormValid,
  } = useForm();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: email,
          password: password,
          nickname: nickname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "회원가입에 실패하였습니다.");
      }

      router.push("/user/appointments");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckNickname = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!nickname) {
      setNicknameCheckError(null);
      setNicknameCheckSuccess(null);
      return;
    }

    setNicknameCheckError(null);
    setNicknameCheckSuccess(null);

    try {
      const response = await fetch("/api/auth/check-nickname", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname }),
      });

      const data = await response.json();

      if (data.isAvailable) {
        setIsNicknameAvailable(true);
        setNicknameCheckSuccess("사용 가능한 닉네임입니다.");
      } else {
        setNicknameCheckError("이미 사용중인 닉네임입니다.");
        setIsNicknameAvailable(false);
      }
    } catch (error) {
      setNicknameCheckSuccess(
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다."
      );

      setIsNicknameAvailable(false);
    }
  };

  const handleChangeNicknameWithReset = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleChangeNickname(e);

    setNicknameCheckError(null);
    setNicknameCheckSuccess(null);
    setIsNicknameAvailable(false);
  };

  return (
    <div className={styles.authFormContainer}>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <EmailInputField
          label="이메일"
          onChange={handleChangeEmail}
          error={submitError ? submitError : emailError}
        />

        <div className={styles.duplicateTest}>
          <InputField
            type="text"
            label="닉네임"
            value={nickname}
            onChange={handleChangeNicknameWithReset}
            placeholder="닉네임을 입력해주세요"
            error={nicknameCheckError ? nicknameCheckError : nicknameError}
            success={nicknameCheckSuccess}
          />
          <Button text="중복검사" size="md" onClick={handleCheckNickname} />
        </div>
        <InputField
          type="password"
          label="비밀번호"
          value={password}
          onChange={habdleChangePassword}
          placeholder="비밀번호를 입력해주세요"
          error={passwordError}
        />
        <InputField
          type="password"
          label="비밀번호 확인"
          value={passwordCheck}
          onChange={habdleChangePasswordCheck}
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          error={passwordCheckError}
        />

        <Button
          text={isLoading ? "처리중..." : "회원가입"}
          size="lg"
          active={isFormValid}
        />

        <p className={styles.loginLink}>
          계정이 있으신가요? <Link href={"/login"}>로그인 하러가기</Link>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
