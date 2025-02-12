"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import "./MyCalendar.scss";
import koLocale from "@fullcalendar/core/locales/ko";
import { getEventsStatus } from "@/utils/user/getEventsStatus";
import { Event } from "@/types/Event";
import CalendarSkeleton from "./user-skeleton/CalendarSkeleton";

const MyCalendar = ({
  onAppointmentsFetch,
  selectedStatus,
}: {
  onAppointmentsFetch: (appointments: Event[]) => void;
  selectedStatus: string | null;
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const appointmentsListFetch = async () => {
      setIsLoading(true);
      const response = await fetch("/api/user/user-appointments");
      const appointments = await response.json();

      const transformedEvents = appointments.map((event: Event) => {
        const { status, color } = getEventsStatus(event);

        return {
          ...event,
          status,
          color,
        };
      });

      setEvents(transformedEvents);
      onAppointmentsFetch(transformedEvents);
      setIsLoading(false);
    };

    appointmentsListFetch();
  }, [onAppointmentsFetch]);

  const filteredEvents = selectedStatus
    ? events.filter((event) => event.status === selectedStatus)
    : events;

  return (
    <div className="calendarWrapper">
      {isLoading ? (
        <CalendarSkeleton />
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          firstDay={1}
          events={filteredEvents}
          eventDisplay="block"
          eventContent={(eventInfo) => {
            return (
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {eventInfo.event.title}
              </div>
            );
          }}
          locale={koLocale}
          titleFormat={{ year: "2-digit", month: "long" }}
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}
          fixedWeekCount={false}
        />
      )}
    </div>
  );
};

export default MyCalendar;
