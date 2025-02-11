import { useUser } from "@/context/UserContext";
import { Appointment } from "@/domain/entities/Appointment";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useEntry = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();

  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;

  const [appointment, setAppointment] = useState<Appointment>();

  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const answerActive = answer.trim() !== "";

  // 이벤트 핸들러러
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    if (error) setError("");
  };

  // 약속 정보 가져오기 (API)
  const fetchGetAppointment = async () => {
    try {
      const res = await fetch(`/api/user/appointments/${appointmentId}/entry`);

      const appointmentData = await res.json();
      setAppointment(appointmentData);
    } catch (error) {
      console.log("오류 발생 :", error);
    } finally {
      setLoading(false);
    }
  };

  // 약속 참여하기 (API)
  const fetchEntryMember = async () => {
    if (!handleValidation()) return;

    try {
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
        if (appointment?.status === "voting") { // 투표중이면
          router.push(`/user/appointments/${appointmentId}/vote-time`);
        } else { // 확정이면
          router.push(`/user/appointments/${appointmentId}/information`);
        }
      }
    } catch (error) {
      console.log("오류 발생 :", error);
    }
  };

  // 약속 참여 비밀번호 검사
  const handleValidation = () => {
    const isAnswer = answer.trim().toLowerCase() !== appointment?.answer;
    
    if (isAnswer) {
      setError("답이 틀렸습니다.");
      return false;
    }
    setError("");
    return true;
  };

  useEffect(() => {
    if (user) {
      fetchGetAppointment();
    }
  }, [user]);

  return {
    hooks: {
      loading,
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
