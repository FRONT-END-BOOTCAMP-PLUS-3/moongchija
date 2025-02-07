"use client";

import Button from "@/components/button/Button";
import IconHeader from "@/components/header/IconHeader";
import InputField from "@/components/input-filed/InputFiled";
import Moongchi from "@/components/moongchi/Moongchi";
import { getUserIdClient } from "@/utils/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./entry.module.scss";
import { Appointment } from '@/domain/entities/Appointment';

const EntryPage = () => {
  const [userId, setUserId] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();

  const [appointment, setAppointment] = useState<Appointment>();
  
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const appointmentId = params.id as string;

  const answerActive = useMemo(() => answer.trim() !== "", [answer]);

  const fetchGetUserId = async () => {
    const userId = await getUserIdClient();
    setUserId(userId);

    if (!userId) {
      alert("❌ 로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      router.push("/login");
      return;
    }
  };

  useEffect(() => {
    fetchGetUserId();
    fetchGetAppointment();
  }, []);

  const fetchGetAppointment = async () => {
    try {        
      const res = await fetch(`/api/user/appointments/${appointmentId}/entry`);
      
      const appointmentData = await res.json();
      setAppointment(appointmentData);

    } catch (error) {
      console.log("오류 발생 :", error);
    }
  }

  const fetchEntryMember = async () => {
    if (!handleValidation()) return;

    try {
      const response = await fetch(`/api/user/appointments/${appointmentId}/entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId : userId })
      });
      
      if (response.status === 200) {
        router.push(`/user/appointments/${appointmentId}/vote-time`);
      }

    } catch (error) {
      console.log("오류 발생 :", error);
    }
  };

  const handleValidation = () => {
    if (answer.trim() !== appointment?.answer) {
      setError("답이 틀렸습니다.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    if (error) setError("");
  };

  return (
    <>
      <IconHeader />
      <div className={styles.completeContainer}>
        <Moongchi />
        <h2 className={styles.title}>퀴즈를 맞혀보세요!</h2>

        <section className={styles.sectionContainer}>
          <div className={styles.infoRow}>
            <span className={styles.label}>약속 이름</span>
            <span>{appointment?.title}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>퀴즈</span>
            <span>{appointment?.quiz}</span>
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
          <Button
            text="참여"
            size="lg"
            active={answerActive}
            onClick={fetchEntryMember}
          />
        </section>
      </div>
    </>
  );
};

export default EntryPage;
