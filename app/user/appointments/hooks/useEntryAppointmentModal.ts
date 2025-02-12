import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useEntryAppointmentModal = () => {
  const router = useRouter();
  const { user } = useUser();
  const [appointmentId, setAppointmentId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleRoomNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentId(e.target.value);
  };

  const validateInput = () => {
    if (appointmentId.trim() === "") {
      setError("방 번호를 입력해주세요.");
      return false;
    }
    return true;
  };

  const fetchCheckAppointmentEntryApi = async () => {
    try {
      const response = await fetch(
        `/api/user/check-appointment-entry?appointmentId=${appointmentId}&userId=${user?.id}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "방 입장 여부 확인에 실패했습니다.");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const fetchCheckAppointmentEntry = async () => {
    if (!validateInput()) return;

    const result = await fetchCheckAppointmentEntryApi();

    if (result && result.redirect) {
      router.push(result.redirect);
    }
  };

  return {
    hooks: {
      appointmentId,
      error,
    },
    handlers: {
      handleRoomNumberChange,
      fetchCheckAppointmentEntry,
    },
  };
};

export default useEntryAppointmentModal;
