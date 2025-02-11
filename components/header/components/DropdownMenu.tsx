"use client";

import React from "react";
import styles from "./DropdownMenu.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DropdownMenu: React.FC = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { redirectUrl } = await response.json();

      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (error) {
      console.log(error);
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
