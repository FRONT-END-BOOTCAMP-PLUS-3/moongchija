"use client";

import React, { useState } from "react";
import DropdownMenu from "./DropdownMenu";
import styles from "./Header.module.scss";

interface HeaderProps {
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [username, setUsername] = useState<string>("고뭉치");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className={styles.header}>
      <section className={styles.container}>
        {children}
        <div className={styles.userContainer}>
          <span onClick={toggleDropdown} className={styles.username}>
            {username}님
          </span>
          {isDropdownOpen && <DropdownMenu />}
        </div>
      </section>
    </div>
  );
};

export default Header;
