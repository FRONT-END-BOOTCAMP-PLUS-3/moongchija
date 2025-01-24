"use client";

import InputField from "@/components/input-filed/InputFiled";
import styles from "./LoginForm.module.scss";
import Button from "@/components/button/Button";
const LoginForm = () => {
  const handleChange = () => {
    console.log("hi");
  };

  return (
    <form className={styles.formBox}>
      <InputField
        label="이메일"
        value=""
        onChange={handleChange}
        placeholder="이메일을 입력해주세요"
      />
      <InputField
        label="비밀번호"
        value=""
        onChange={handleChange}
        placeholder="비밀번호를 입력해주세요"
      />
      <Button text="로그인" size="lg" />
    </form>
  );
};

export default LoginForm;
