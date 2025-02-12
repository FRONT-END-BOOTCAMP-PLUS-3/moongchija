import { useUser } from "@/context/UserContext";
import { Appointment } from "@/domain/entities/Appointment";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const useEntry = () => {
  const [loadingAppointment, setLoadingAppointment] = useState<boolean>(true);
  const [loadingEntry, setLoadingEntry] = useState<boolean>(false);
  const { user } = useUser();

  const router = useRouter();
  const params = useParams();
  const appointmentId = useMemo(() => params.id as string, [params.id]);

  const [appointment, setAppointment] = useState<Appointment>();

  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const answerActive = answer.trim() !== "";

  // 이벤트 핸들러
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    if (error) setError("");
  };

  // 약속 정보 가져오기 (API)
  const fetchGetAppointment = async () => {
    try {
      const res = await fetch(`/api/user/appointments/${appointmentId}/entry`);

      const appointmentData = await res.json();
      
      // 기존 상태와 비교 후 다를 때만 업데이트
      setAppointment((prev) =>
        JSON.stringify(prev) !== JSON.stringify(appointmentData)
          ? appointmentData
          : prev
      );
    } catch (error) {
      console.log("오류 발생 :", error);
    } finally {
      setLoadingAppointment(false);
    }
  };

  // 약속 참여하기 (API)
  const fetchEntryMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!handleValidation()) return;

    try {
      setLoadingEntry(true);
      const response = await fetch(
        `/api/user/appointments/${appointmentId}/entry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user?.id }),
        }
      );

      if (response.status === 200) {
        if (appointment?.status) {
          handleRoute(appointment.status);
        }
      }
    } catch (error) {
      console.log("오류 발생 :", error);
    }
  };

  const handleRoute = (status: string) => {
    if (status === "voting") {
      // 투표중이면
      router.push(`/user/appointments/${appointmentId}/vote-time`);
    } else {
      // 확정이면
      router.push(`/user/appointments/${appointmentId}/information`);
    }
  };

  // 약속 참여 비밀번호 검사
  const handleValidation = () => {
    const isAnswer = answer.trim().toLowerCase() !== appointment?.answer;

    if (isAnswer) {
      if (!error) setError("답이 틀렸습니다.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!appointmentId) return;
    fetchGetAppointment();
  }, [appointmentId]);

  return {
    hooks: {
      loadingAppointment,
      loadingEntry,
      appointment,
      answer,
      error,
      answerActive,
    },
    handlers: {
      handleAnswerChange,
      fetchEntryMember,
    },
  };
};

export default useEntry;
