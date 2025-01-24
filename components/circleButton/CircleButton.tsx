"use client";

import React from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./CircleButton.module.scss";

interface CircleButtonProps {
  onClick: () => void;
}

const CircleButton: React.FC<CircleButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.circleButton} onClick={onClick}>
      <FaPlus size={20} color="#ffffff" />
    </button>
  );
};

export default CircleButton;
