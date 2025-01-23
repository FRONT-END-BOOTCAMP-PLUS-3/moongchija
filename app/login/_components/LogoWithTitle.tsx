"use client";

import styles from "./LogoWithTitle.module.scss";
import Image from "next/image";

const LogoWithTitle = () => {
  return (
    <div className={styles.topBox}>
      <Image
        src={"/images/logos/main-logo.svg"}
        width={209}
        height={209}
        alt="메인 로고"
      />
      <span className={styles.loginTitle}>로그인</span>
    </div>
  );
};

export default LogoWithTitle;
