import { Event } from "@/types/Event";

export const getEventsStatus = (event: Event) => {
  const startTime = new Date(event.start);
  const confirmTime = event.confirmed_time
    ? new Date(event.confirmed_time)
    : null;

  if (event.status === "voting") {
    return { status: "voting", color: "#64c964" };
  }

  if (event.status === "confirmed") {
    if (confirmTime && confirmTime < startTime) {
      return { status: "scheduled", color: "#fd8446" };
    }
    return { status: "confirmed", color: "#fd565f" };
  }
  return { status: event.status, color: "#000000" };
};
