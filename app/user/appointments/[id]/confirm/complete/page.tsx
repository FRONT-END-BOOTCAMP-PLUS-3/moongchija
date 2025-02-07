"use client";

import styles from "./complete.module.scss";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/button/Button";
import Moongchi from "@/components/moongchi/Moongchi";
import IconHeader from "@/components/header/IconHeader";
import { copyToClipboard } from "@/utils/copy/copyUtils";

const CompletePage = () => {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [isCopiedRoomId, setIsCopiedRoomId] = useState(false);

  // const handleCopyInviteLink = async () => {
  //   try {
  //     await navigator.clipboard.writeText(
  //       `http://localhost:3000/user/appointments/${appointmentId}/entry`
  //     );
  //     setIsCopiedLink(true);
  //     setTimeout(() => setIsCopiedLink(false), 2000);
  //   } catch (error) {
  //     alert("초대링크 복사에 실패했습니다.");
  //   }
  // };

  // const handleCopyRoomId = async () => {
  //   try {
  //     await navigator.clipboard.writeText(appointmentId);
  //     setIsCopiedRoomId(true);
  //     setTimeout(() => setIsCopiedRoomId(false), 2000);
  //   } catch (error) {
  //     alert("방번호 복사에 실패했습니다.");
  //   }
  // };

  // 모바일 환경에서도 작동하는 복사 함수
  // ✅ 초대링크 복사
  const handleCopyInviteLink = () => {
    copyToClipboard(
      `https://yourdomain.com/user/appointments/${appointmentId}/entry`,
      setIsCopiedLink,
      "초대링크 복사에 실패했습니다."
    );
  };

  // ✅ 방번호 복사
  const handleCopyRoomId = () => {
    copyToClipboard(
      appointmentId,
      setIsCopiedRoomId,
      "방번호 복사에 실패했습니다."
    );
  };

  return (
    <div className={styles.completeContainer}>
      <IconHeader />
      <div className={styles.mainBox}>
        <div className={styles.wrapLogo}>
          <Moongchi />
        </div>

        <h2 className={styles.title}>약속이 확정 됐어요</h2>
        <p className={styles.description}>
          추가로 초대하고 싶은 멤버가 있다면 <br />
          아래 초대링크를 공유해주세요!
        </p>

        <div className={styles.copyButtonWrapper}>
          <button onClick={handleCopyInviteLink} className={styles.copyButton}>
            초대링크 복사
          </button>
          <p className={styles.copyAlert}>
            {isCopiedLink ? "✅ 초대링크가 복사되었습니다!" : ""}
          </p>

          <button onClick={handleCopyRoomId} className={styles.copyButton}>
            방번호 복사
          </button>
          <p className={styles.copyAlert}>
            {isCopiedRoomId ? "✅ 방번호가 복사되었습니다!" : ""}
          </p>
        </div>

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
    </div>
  );
};

export default CompletePage;
