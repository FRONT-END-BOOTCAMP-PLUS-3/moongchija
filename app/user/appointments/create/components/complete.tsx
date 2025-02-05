"use client";

import styles from "./complete.module.scss";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Button from "@/components/button/Button";
import Moongchi from "@/components/moongchi/Moongchi";

interface Props {
  onIsComplete: () => void;
}

const CreateComplete: React.FC<Props> = ({ onIsComplete }) => {
  const [copyActive, setCopyActive] = useState<boolean>(false);
  const router = useRouter();
  const appointmentId = 1; // TODO: 상태 관리로 동적 ID 가져오기

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = async (text: string, type: "link" | "id") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
      setCopyActive(true);
    } catch {
      alert(type === "link" ? "초대링크 복사 실패" : "방번호 복사 실패");
    }
  };

  useEffect(() => {
    onIsComplete();
  }, []);

  return (
    <div className={styles.completeContainer}>
      <div className={styles.logo}>
        <Moongchi />
      </div>
      <h2 className={styles.title}>약속이 생성되었어요</h2>
      <p className={styles.description}>
        투표를 완료하고, <br />
        약속을 확정해주세요!
      </p>

      <div className={styles.copyGroup}>
        <div className={styles.copyButtonWrapper}>
          <button
            onClick={() =>
              handleCopy(
                `http://localhost:3000/user/appointments/${appointmentId}/entry`,
                "link"
              )
            }
            className={styles.copyButton}
          >
            초대링크 복사
          </button>
          {copiedText === "link" && (
            <p className={styles.copyAlert}>✅ 초대링크가 복사되었습니다!</p>
          )}
        </div>

        <div className={styles.copyButtonWrapper}>
          <button
            onClick={() => handleCopy(`${appointmentId}`, "id")}
            className={styles.copyButton}
          >
            방번호 복사
          </button>
          {copiedText === "id" && (
            <p className={styles.copyAlert}>✅ 방번호가 복사되었습니다!</p>
          )}
        </div>
      </div>

      <div className={styles.wrapButton}>
        <Button
          text="투표하러 가기"
          size="lg"
          active={copyActive}
          onClick={() =>
            router.push(`/user/appointments/${appointmentId}/vote-time`)
          }
        />
      </div>
    </div>
  );
};

export default CreateComplete;
