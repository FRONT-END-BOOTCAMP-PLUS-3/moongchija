"use client";

import Moongchi from "@/components/moongchi/Moongchi";
import styles from "./LogoWithTitle.module.scss";
import Image from "next/image";

const LogoWithTitle = () => {
  return (
    <div className={styles.topBox}>
      <Moongchi />
      <h1 className={styles.loginTitle}>로그인</h1>
    </div>
  );
};

export default LogoWithTitle;
