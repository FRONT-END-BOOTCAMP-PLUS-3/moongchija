"use client"

import React, { useState } from "react";
import styles from "./TabMenu.module.scss";

interface TabMenuProps {
  tabs: string[];
  onTabChange: (index: number) => void;
}

const TabMenu: React.FC<TabMenuProps> = ({ tabs, onTabChange }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    onTabChange(index);
  };

  return (
    <div className={styles.container}>
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={activeTab === index ? styles.active : ""}
          onClick={() => handleTabClick(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabMenu;
