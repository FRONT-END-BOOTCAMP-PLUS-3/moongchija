"use client";
import Button from "@/components/button/Button";
import InputField from "@/components/input-filed/InputFiled";
import styles from "./AuthForm.module.scss";
// import { useState } from "react";
import useInput from "../_hooks/useInput";
// import { useState } from "react";

const AuthForm = () => {
  const { value: email, onChange: habdleChangeEmail } = useInput("");
  const { value: nickname, onChange: habdleChangeNickname } = useInput("");
  const { value: password, onChange: habdleChangePassword } = useInput("");
  const { value: passwordCheck, onChange: habdleChangePasswordCheck } =
    useInput("");

  // const [submittedValues, setSubmittedValues] = useState({
  //   email: "",
  //   nickname: "",
  //   password: "",
  //   passwordCheck: "",
  // });

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   setSubmittedValues({
  //     email,
  //     nickname,
  //     password,
  //     passwordCheck,
  //   });
  // };

  return (
    <div className={styles.authFormContainer}>
      <form className={styles.signupForm}>
        <InputField
          type="email"
          label="이메일"
          value={email}
          onChange={habdleChangeEmail}
          placeholder="이메일을 입력해주세요"
        />
        <div className={styles.duplicateTest}>
          <InputField
            type="text"
            label="닉네임"
            value={nickname}
            onChange={habdleChangeNickname}
            placeholder="닉네임을 입력해주세요"
          />
          <Button text="중복검사" size="md" />
        </div>
        <InputField
          type="password"
          label="비밀번호"
          value={password}
          onChange={habdleChangePassword}
          placeholder="비밀번호를 입력해주세요"
        />
        <InputField
          type="password"
          label="비밀번호 확인"
          value={passwordCheck}
          onChange={habdleChangePasswordCheck}
          placeholder="비밀번호를 한번 더 압력해주세요"
        />
        <Button text="회원가입" size="lg" active={false} />
      </form>
    </div>
  );
};

export default AuthForm;
