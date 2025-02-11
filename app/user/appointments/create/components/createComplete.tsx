"use client";

import React from "react";
import styles from "./createComplete.module.scss";
import Button from "@/components/button/Button";
import Moongchi from "@/components/moongchi/Moongchi";
import useCreateComplete from "../hooks/useCreateComplete";

interface Props {
  onIsComplete: () => void;
}

const CreateComplete: React.FC<Props> = ({ onIsComplete }) => {
  const {
    basicUrl,
    hooks: { router, copyActive, copiedText, appointmentId },
    handlers: { handleCopy },
  } = useCreateComplete(onIsComplete);

  return (
    <div className={styles.completeContainer}>
      <div className={styles.mainBox}>
        <div className={styles.wrapLogo}>
          <Moongchi />
        </div>

        <h2 className={styles.title}>약속이 확정 됐어요</h2>
        <p className={styles.description}>
          투표를 완료하고, <br />
          약속을 확정해주세요!
        </p>

        <div className={styles.copyButtonWrapper}>
          <button
            onClick={() =>
              handleCopy(
                `${basicUrl}/user/appointments/${appointmentId}/entry`,
                "link"
              )
            }
            className={styles.copyButton}
          >
            초대링크 복사
          </button>
          <p className={styles.copyAlert}>
            {copiedText === "link" ? "✅ 초대링크가 복사되었습니다!" : ""}
          </p>

          <button
            onClick={() => handleCopy(`${appointmentId}`, "id")}
            className={styles.copyButton}
          >
            방번호 복사
          </button>
          <p className={styles.copyAlert}>
            {copiedText === "id" ? "✅ 방번호가 복사되었습니다!" : ""}
          </p>
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
    </div>
  );
};

export default CreateComplete;
