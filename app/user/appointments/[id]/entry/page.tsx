"use client";

import styles from "./entry.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMemo, useState } from "react";
import Button from "@/components/button/Button";
import InputField from "@/components/input-filed/InputFiled";

const EntryPage = () => {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const appointmentId = 1; // TODO: 상태 관리로 동적 ID 가져오기

  const answerActive = useMemo(() => answer.trim() !== "", [answer]);

  const handleValidation = () => {
    if (answer.trim() !== "정답") {
      setError("답이 틀렸습니다.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerActive && handleValidation()) {
      router.push(`/user/appointments/${appointmentId}/vote-time`);
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    if (error) setError("");
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
      <h2 className={styles.title}>퀴즈를 맞혀보세요!</h2>

      <section className={styles.sectionContainer}>
        <div className={styles.infoRow}>
          <span className={styles.label}>약속 이름</span>
          <span>홍대 모임</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>퀴즈</span>
          <span>내 MBTI는?</span>
        </div>

        <div className={styles.inputContainer}>
          <InputField
            label="퀴즈 답"
            value={answer}
            placeholder="퀴즈 답을 입력하세요."
            onChange={handleAnswerChange}
            error={error}
          />
        </div>
      </section>

      <section className={styles.wrapButton}>
        <Button text="참여" size="lg" active={answerActive} onClick={handleSubmit} />
      </section>
    </div>
  );
};

export default EntryPage;
