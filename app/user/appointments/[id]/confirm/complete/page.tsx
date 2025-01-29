"use client";

import styles from "./complete.module.scss";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import Button from "@/components/button/Button";

const CompletePage = () => {
  const params = useParams(); // URL에서 ID 추출
  const router = useRouter();
  const appointmentId = params.id as string; // ID값 추출

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(
        `http://localhost:3000/user/appointments/${appointmentId}/entry`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2초 후 알림 제거
    } catch (error) {
      alert("방번호 복사에 실패했습니다.");
    }
  };

  return (
    <div className={styles.completeContainer}>
      <Image
        src="/images/logos/main-logo.svg"
        alt="메인 로고"
        width={270}
        height={270}
        className={styles.logo}
      />

      <h2 className={styles.title}>약속이 확정 됐어요</h2>
      <p className={styles.description}>
        추가로 초대하고 싶은 멤버가 있다면 <br />
        아래 초대링크를 공유해주세요!
      </p>

      <button onClick={handleCopyRoomId} className={styles.copyButton}>
        초대링크 복사
      </button>
      {isCopied && (
        <p className={styles.copyAlert}>✅ 초대링크가 복사되었습니다!</p>
      )}
      <div className={styles.wrapButton}>
        <Button
          text="약속 페이지 가기"
          size="lg"
          onClick={() =>
            router.push(`/user/appointments/${appointmentId}/information`)
          }
        />
      </div>
    </div>
  );
};

export default CompletePage;
