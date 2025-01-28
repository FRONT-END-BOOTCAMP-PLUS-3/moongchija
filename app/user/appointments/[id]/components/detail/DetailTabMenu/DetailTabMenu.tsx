"use client";

import { usePathname } from "next/navigation";
import styles from "./DetailTabMenu.module.scss";

const DetailTabMenu = () => {
  const pathname = usePathname();

  // 현재 URL과 탭 경로를 비교해 활성 상태 결정
  const isActive = (path: string) => pathname.includes(path);

  return (
    <div className={styles.container}>
      <div className={`${styles.information} ${isActive("information") ? styles.active : ""}`}>
        <button onClick={() => (window.location.href = "/user/appointments/1/information")}>
          약속 정보
        </button>
      </div>

      <div className={`${styles.settlement} ${isActive("settlement") ? styles.active : ""}`}>
        <button onClick={() => (window.location.href = "/user/appointments/1/settlement")}>
          정산 하기
        </button>
      </div>

      <div className={`${styles.gallery} ${isActive("gallery") ? styles.active : ""}`}>
        <button onClick={() => (window.location.href = "/user/appointments/1/gallery")}>
          추억 공간
        </button>
      </div>
    </div>
  );
};

export default DetailTabMenu;
