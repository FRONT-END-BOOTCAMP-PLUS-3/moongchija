"use client";

import React from "react";
import styles from "./DropdownMenu.module.scss";
import Link from "next/link";


const DropdownMenu: React.FC = () => {
  const handleLogout = () => {
    // TODO: 실제 로그아웃 로직 추가
    console.log("로그아웃");
  };

  return (
    <div className={styles.dropdown}>
      <Link href="/mypage" className={styles.dropdownItem}>
        마이페이지
      </Link>
      <button onClick={handleLogout} className={styles.dropdownItem}>
        로그아웃
      </button>
    </div>
  );
};

export default DropdownMenu;
