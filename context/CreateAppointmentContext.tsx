"use client";

import { Appointment } from "@/domain/entities/Appointment";
import { PlaceVote } from "@/domain/entities/PlaceVote";
import { getUserIdClient } from "@/utils/supabase/client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from 'next/navigation';

type CreateAppointmentContextType = {
  appointment: Appointment;
  setAppointment: (
    appointment: Appointment | ((prev: Appointment) => Appointment)
  ) => void;
  placeVotes: PlaceVote[];
  setPlaceVotes: (votes: PlaceVote[]) => void;
  createAppointment: () => void;
};

const CreateAppointmentContext = createContext<
  CreateAppointmentContextType | undefined
>(undefined);

export const CreateAppointmentProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [appointment, setAppointment] = useState<Appointment>({
    id: null,
    confirm_time: null,
    confirm_place: null,
    confirm_place_url: null,
    status: "voting",
    result_time: null,
    result_place: null,
    title: "",
    quiz: "내 MBTI는?",
    answer: "",
    start_time: "",
    end_time: "",
    created_at: "",
    owner_id: "",
  });

  const [placeVotes, setPlaceVotes] = useState<PlaceVote[]>([]);

  async function createAppointment() {
    try {
      const userId = await getUserIdClient();
      if (!userId) {
        alert("❌ 로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        router.push("/login");
        return null;
      }

      const newAppointment: Appointment = { ...appointment, owner_id: userId };

      const response = await fetch("/api/user/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment: newAppointment, placeVotes }),
      });

      if (!response.ok) throw new Error("Failed to create appointment");

      const data: Appointment = await response.json();
      console.log("✅ Appointment Created:", data);

      setAppointment(data);
    } catch (error) {
      console.error("❌ 약속 생성 오류가 발생하였습니다. :", error);
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
