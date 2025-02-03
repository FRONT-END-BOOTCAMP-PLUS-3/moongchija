"use client";

import React, { useState } from "react";
import DropdownMenu from "./DropdownMenu";
import styles from "./Header.module.scss";

interface HeaderProps {
  children: React.ReactNode;
  showUsername?: boolean;
}

const Header: React.FC<HeaderProps> = ({ children, showUsername = true }) => {
  const [username, setUsername] = useState<string>("고뭉치");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

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
    <div className={styles.header}>
      <section className={styles.container}>
        {children}
        <div className={styles.userContainer}>
          {showUsername ? (
            <span onClick={toggleDropdown} className={styles.username}>
              {username}님
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
