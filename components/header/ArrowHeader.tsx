"use client";

import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import Header from "./Header";

interface ArrowHeaderProps {
  setValue?: React.Dispatch<React.SetStateAction<number>>;
}

const ArrowHeader: React.FC<ArrowHeaderProps> = ({ setValue }) => {

  const handleBack = () => {
    if (setValue) {
      setValue((prev) => {
        if (prev <= 1) {
          window.history.back();
          return prev;
        }
        return prev - 1;
      });
    } else {
      window.history.back();
    }
  };

  return (
    <Header>
      <FaArrowLeftLong size={30} onClick={handleBack} style={{ cursor: "pointer" }} />
    </Header>
  );
};

export default ArrowHeader;
