"use client";

import { Appointment } from "@/domain/entities/Appointment";
import { PlaceVote } from "@/domain/entities/PlaceVote";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useUser } from "./UserContext";

type CreateAppointmentContextType = {
  appointment: Appointment;
  setAppointment: React.Dispatch<React.SetStateAction<Appointment>>;
  placeVotes: PlaceVote[];
  setPlaceVotes: React.Dispatch<React.SetStateAction<PlaceVote[]>>;
  createAppointment: () => Promise<void>;
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
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const initialAppointment = useMemo<Appointment>(
    () => ({
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
    }),
    []
  );

  const [appointment, setAppointment] = useState<Appointment>(initialAppointment);
  const [placeVotes, setPlaceVotes] = useState<PlaceVote[]>([
    { place: "", place_url: "", appointment_id: null },
  ]);

  const createAppointment = useCallback(async () => {
    setLoading(true);
    try {
      const newAppointment: Appointment = {
        ...appointment,
        owner_id: user!.id,
        answer: appointment.answer?.trim().toLowerCase() ?? "",
      };

      const response = await fetch("/api/user/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment: newAppointment, placeVotes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create appointment");
      }

      const data: Appointment = await response.json();
      setAppointment(data);
    } catch (error) {
      console.error("❌ 약속 생성 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  }, [appointment, placeVotes, router]);

  const contextValue = useMemo(
    () => ({
      appointment,
      setAppointment,
      placeVotes,
      setPlaceVotes,
      createAppointment,
      loading,
    }),
    [appointment, placeVotes, createAppointment, loading]
  );

  return (
    <CreateAppointmentContext.Provider value={contextValue}>
      {children}
    </CreateAppointmentContext.Provider>
  );
};

export const useCreateAppointment = () => {
  const context = useContext(CreateAppointmentContext);
  if (!context) {
    throw new Error(
      "useCreateAppointment must be used within a CreateAppointmentProvider"
    );
  }
  return context;
};
