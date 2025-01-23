"use client";

import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import Header from "./Header";
import Link from "next/link";

const ArrowHeader: React.FC = () => {
  return (
    <Header>
      <Link href="/">
        <FaArrowLeftLong size={30} />
      </Link>
    </Header>
  );
};

export default ArrowHeader;
