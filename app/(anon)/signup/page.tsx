"use client";
import AuthForm from "./components/AuthForm";
import styles from "./signup.module.scss";

const SignupPage = () => {
  return (
    <div className={styles.signupContainer}>
      <h1 className={styles.signupTitle}>회원가입</h1>

      <AuthForm />
    </div>
  );
};

export default SignupPage;
