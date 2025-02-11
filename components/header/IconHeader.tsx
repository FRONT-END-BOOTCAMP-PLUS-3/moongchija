"use client";

import logo from "@/public/images/logos/sub-logo.svg";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "./components/Header";

const IconHeader: React.FC<{ showUsername?: boolean }> = ({
  showUsername = true,
}) => {
  return (
    <Header showUsername={showUsername}>
      <Link href="/user/appointments">
        <Image src={logo} alt="logo" width={40} />
      </Link>
    </Header>
  );
};

export default IconHeader;
