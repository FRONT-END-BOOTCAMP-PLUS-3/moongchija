import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useCreateAppointment } from "@/context/CreateAppointmentContext";
import { fallbackCopy } from "@/utils/copy/copyUtils";

const useCreateComplete = (onIsComplete: () => void) => {
  const basicUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const router = useRouter();
  const { appointment } = useCreateAppointment();

  const [copyActive, setCopyActive] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const appointmentId = appointment.id || "";

  const handleCopy = useCallback((text: string, type: "link" | "id") => {
    fallbackCopy(text, setCopyActive, type === "link" ? "초대링크 복사 실패" : "방번호 복사 실패");
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
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
