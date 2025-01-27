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
  color?: string;
}
const MyCalendar = () => {
  // 이벤트 데이터
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const userEvents = [
      {
        title: "회의",
        start: "2025-01-27",
        end: "2025-01-27",
        color: "#9cc0ff",
      },
      {
        title: "프로젝트 마감",
        start: "2025-01-27",
        end: "2025-01-27",
        color: "#9cc0ff",
      },
      {
        title: "개인 일정",
        start: "2025-01-27",
        end: "2025-01-27",
        color: "#9cc0ff",
      },
    ];
    setEvents(userEvents);
  }, []);

  return (
    <div className="calendarWrapper">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        firstDay={1}
        events={events}
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
