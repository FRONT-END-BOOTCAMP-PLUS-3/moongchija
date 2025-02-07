"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import "./MyCalendar.scss";
import koLocale from "@fullcalendar/core/locales/ko";

interface Event {
  title: string;
  start: string;
  end: string;
  confirm_time: string;
  status: string;
}

const MyCalendar = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const getEventsStatus = (event: Event) => {
    const startTime = event.start;
    const confirmTime = event.confirm_time ? event.confirm_time : null;

    if (event.status === "voting") {
      return { status: "voting", color: "#64c964" };
    }

    if (event.status === "confirmed") {
      if (confirmTime && confirmTime < startTime) {
        return { status: "scheduled", color: "##fd8446" };
      }
      return { status: "confirmed", color: "#fd565f" };
    }
    return { status: event.status, color: "#000000" };
  };

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
