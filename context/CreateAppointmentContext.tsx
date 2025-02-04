"use client";

import { Appointment } from "@/domain/entities/Appointment";
import { PlaceVote } from "@/domain/entities/PlaceVote";
import { createContext, useContext, useState, ReactNode } from "react";

type CreateAppointmentContextType = {
  appointment: Appointment;
  setAppointment: (appointment: Appointment | ((prev: Appointment) => Appointment)) => void;
  placeVotes: PlaceVote[];
  setPlaceVotes: (votes: PlaceVote[]) => void;
  createAppointment: () => void;
};

const CreateAppointmentContext = createContext<CreateAppointmentContextType | undefined>(
  undefined
);

export const CreateAppointmentProvider = ({ children }: { children: ReactNode }) => {
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

  const createAppointment = () => {
    console.log(appointment);
    console.log(placeVotes);
  }

  console.log("Provider rendered", appointment);

  return (
    <CreateAppointmentContext.Provider
      value={{ appointment, setAppointment, placeVotes, setPlaceVotes, createAppointment }}
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
