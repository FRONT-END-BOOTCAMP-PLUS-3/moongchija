"use client";

import React, { useState } from "react";
import DropdownMenu from "./DropdownMenu";
import styles from "./Header.module.scss";
import { useRouter } from "next/navigation";
import { useUser } from '@/context/UserContext';

interface HeaderProps {
  children: React.ReactNode;
  showUsername?: boolean;
}

const Header: React.FC<HeaderProps> = ({ children, showUsername = true }) => {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

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
    <div className={styles.header}>
      <section className={styles.container}>
        {children}
        <div className={styles.userContainer}>
          {showUsername ? (
            <span onClick={toggleDropdown} className={styles.username}>
              {user?.nickname}님
            </span>
          ) : (
            <button className={styles.logoutButton} onClick={handleLogout}>
              로그아웃
            </button>
          )}
          {isDropdownOpen && <DropdownMenu />}
        </div>
      </section>
    </div>
  );
};

export default Header;
