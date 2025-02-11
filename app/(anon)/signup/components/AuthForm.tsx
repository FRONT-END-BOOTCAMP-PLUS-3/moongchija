"use client";
import Button from "@/components/button/Button";
import InputField from "@/components/input-filed/InputFiled";
import styles from "./AuthForm.module.scss";

import EmailInputField from "./EmailInputField";
import useForm from "../hooks/useForm";
import Link from "next/link";
import useCheckNickname from "../hooks/useCheckNickname";
import useSubmitSignup from "../hooks/useSubmitSignup";

const AuthForm = () => {
  const {
    email: { email, emailError, handleChangeEmail },
    nickname: { nickname, nicknameError, handleChangeNickname },
    password: { password, passwordError, handleChangePassword },
    passwordCheck: {
      passwordCheck,
      passwordCheckError,
      habdleChangePasswordCheck,
    },
    isFormValid,
  } = useForm();

  const {
    isNicknameAvailable,
    nicknameCheckError,
    nicknameCheckSuccess,
    handleCheckNickname,
    resetNicknameCheckState,
  } = useCheckNickname();

  const { submitSignup, isLoading, submitError } = useSubmitSignup();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isNicknameAvailable || !isFormValid) {
      return;
    }

    await submitSignup(email, password, nickname);
  };

  const handleCheckNicknameClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    handleCheckNickname(nickname);
  };

  const handleChangeNicknameWithReset = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleChangeNickname(e);
    resetNicknameCheckState();
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
          <Button
            text="중복검사"
            size="md"
            onClick={handleCheckNicknameClick}
          />
        </div>
        <InputField
          type="password"
          label="비밀번호"
          value={password}
          onChange={handleChangePassword}
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
          active={isFormValid && isNicknameAvailable}
        />

        <p className={styles.loginLink}>
          계정이 있으신가요? <Link href={"/login"}>로그인 하러가기</Link>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
