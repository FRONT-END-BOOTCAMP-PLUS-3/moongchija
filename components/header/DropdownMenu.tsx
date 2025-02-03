"use client";

import React from "react";
import styles from "./DropdownMenu.module.scss";
import Link from "next/link";


const DropdownMenu: React.FC = () => {
  
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else {
        const data = await response.json();
        console.log("로그아웃 성공:", data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.dropdown}>
      <Link href="/user" className={styles.dropdownItem}>
        마이페이지
      </Link>
      <button onClick={handleLogout} className={styles.dropdownItem}>
        로그아웃
      </button>
    </div>
  );
};

export default DropdownMenu;
