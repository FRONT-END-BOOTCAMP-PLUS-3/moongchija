import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useCreateAppointment } from "@/context/CreateAppointmentContext";

const useCreateComplete = (onIsComplete: () => void) => {
  const basicUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const router = useRouter();
  const { appointment } = useCreateAppointment();

  const [copyActive, setCopyActive] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const appointmentId = appointment.id || "";

  const handleCopy = useCallback(async (text: string, type: "link" | "id") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
      setCopyActive(true);
    } catch {
      alert(type === "link" ? "초대링크 복사 실패" : "방번호 복사 실패");
    }
  }, []);

  useEffect(() => {
    onIsComplete();
  }, [onIsComplete]);

  return {
    basicUrl,
    hooks: {
      router,
      copyActive,
      copiedText,
      appointmentId,
    },
    handlers: {
      handleCopy,
    }
  };
};

export default useCreateComplete;
