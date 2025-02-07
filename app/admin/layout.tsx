"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.scss";

const tabs = [
  { name: "유저 관리", href: "/admin/users" },
  { name: "약속 관리", href: "/admin/appointments" },
  { name: "이미지 관리", href: "/admin/images" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.title}>시스템 관리 페이지</h1>
      <div className={styles.nav}>
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`${styles.tab} ${
              pathname === tab.href ? styles.active : ""
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}
