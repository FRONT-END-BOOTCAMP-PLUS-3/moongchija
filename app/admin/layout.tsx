"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.scss";
import Header from "@/components/header/components/Header";

const tabs = [
  { name: "유저 관리", href: "/admin/users" },
  { name: "약속 관리", href: "/admin/appointments" },
  { name: "이미지 관리", href: "/admin/images" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <>
      <div className={styles.adminContainer}>
        <Header
          showUsername={false}
          // eslint-disable-next-line react/no-children-prop
          children={<h1 className={styles.title}>ADMIN</h1>}
        />
        <div className={styles.mainBox}>
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
      </div>
    </>
  );
};

export default AdminLayout;
