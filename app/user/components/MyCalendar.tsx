"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import "./MyCalendar.scss";
import koLocale from "@fullcalendar/core/locales/ko";
import { getEventsStatus } from "@/utils/user/getEventsStatus";
import { Event } from "@/types/Event";

const MyCalendar = ({
  onAppointmentsFetch,
}: {
  onAppointmentsFetch: (appointments: Event[]) => void;
}) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const appointmentsListFetch = async () => {
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
    };

    appointmentsListFetch();
  }, []);

  return (
    <div className="calendarWrapper">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        firstDay={1}
        events={events}
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
    </div>
  );
};

export default MyCalendar;
