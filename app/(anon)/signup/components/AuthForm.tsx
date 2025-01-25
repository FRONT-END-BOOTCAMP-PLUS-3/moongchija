"use client";
import Button from "@/components/button/Button";
import InputField from "@/components/input-filed/InputFiled";
import styles from "./AuthForm.module.scss";

import EmailInputField from "./EmailInputField";
import useForm from "../hooks/useForm";

const AuthForm = () => {
  const {
    email: { email, emailError, handleChangeEmail },
    nickname: { nickname, nicknameError, habdleChangeNickname },
    password: { password, passwordError, habdleChangePassword },
    passwordCheck: {
      passwordCheck,
      passwordCheckError,
      habdleChangePasswordCheck,
    },
    isFormValid,
  } = useForm();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(`email : ${email}
      nickname : ${nickname}
      password: ${password}
      `);
  };

  return (
    <div className={styles.authFormContainer}>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <EmailInputField
          label="이메일"
          onChange={handleChangeEmail}
          error={emailError}
        />
        <div className={styles.duplicateTest}>
          <InputField
            type="text"
            label="닉네임"
            value={nickname}
            onChange={habdleChangeNickname}
            placeholder="닉네임을 입력해주세요"
            error={nicknameError}
          />
          <Button text="중복검사" size="md" />
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
        <Button text="회원가입" size="lg" active={isFormValid} />
      </form>
    </div>
  );
};

export default AuthForm;
