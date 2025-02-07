"use client";

import { Appointment } from "@/domain/entities/Appointment";
import { PlaceVote } from "@/domain/entities/PlaceVote";
import { getUserIdClient } from "@/utils/supabase/client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type CreateAppointmentContextType = {
  appointment: Appointment;
  setAppointment: (
    appointment: Appointment | ((prev: Appointment) => Appointment)
  ) => void;
  placeVotes: PlaceVote[];
  setPlaceVotes: (votes: PlaceVote[]) => void;
  createAppointment: () => void;
  loading: boolean;
};

const CreateAppointmentContext = createContext<
  CreateAppointmentContextType | undefined
>(undefined);

export const CreateAppointmentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [appointment, setAppointment] = useState<Appointment>({
    confirm_time: null,
    confirm_place: null,
    confirm_place_url: null,
    status: "voting",
    title: "",
    quiz: "내 MBTI는?",
    answer: "",
    start_time: "",
    end_time: "",
    owner_id: "",
  });

  const [placeVotes, setPlaceVotes] = useState<PlaceVote[]>([
    {
      place: "",
      place_url: "",
      appointment_id: null,
    },
  ]);

  async function createAppointment() {
    setLoading(true);
    try {
      const userId = await getUserIdClient();
      if (!userId) {
        alert("❌ 로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        router.push("/login");
        return null;
      }

      const newAppointment: Appointment = { ...appointment, owner_id: userId };
      const requestBody = JSON.stringify({
        appointment: newAppointment,
        placeVotes,
      });

      const response = await fetch("/api/user/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create appointment");
      }

      const data: Appointment = await response.json();

      setAppointment(data);
    } catch (error) {
      console.error("❌ 약속 생성 오류가 발생하였습니다. :", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CreateAppointmentContext.Provider
      value={{
        appointment,
        setAppointment,
        placeVotes,
        setPlaceVotes,
        createAppointment,
        loading
      }}
    >
      {children}
    </CreateAppointmentContext.Provider>
  );
};
export const useCreateAppointment = () => {
  const context = useContext(CreateAppointmentContext);
  if (!context) {
    throw new Error(
      "useAppointment must be used within an AppointmentProvider"
    );
  }
  return context;
};
