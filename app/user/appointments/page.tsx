"use client";

import React, { useState } from "react";
import styles from "./AppointmentsPage.module.scss";
import TabMenu from "../../../components/tabMenu/TabMenu";
import AppointmentList from "./components/AppointmentList";
import CircleButton from "@/components/circleButton/CircleButton";

const AppointmentsPage: React.FC = () => {
  const tabs = ["투표 진행중", "약속 리스트"];
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const handleTabChange = (index: number) => {
    setCurrentTab(index);
  };

  const handleCircleButtonClick = () => {
    setShowButtons((prev) => !prev);
  };

  return (
    <>
      <TabMenu tabs={tabs} onTabChange={handleTabChange} />
      <main className={styles.container}>
        <section className={styles.listBox}>
          {currentTab === 0 && (
            <AppointmentList appointments={dummyListBoxData} />
          )}
          {currentTab === 1 && (
            <AppointmentList appointments={dummyListBoxData} />
          )}
        </section>

        {/* 하단 + 버튼 */}
        <CircleButton onClick={handleCircleButtonClick} />
        <section
          className={`${styles.buttonBox} ${
            showButtons ? styles.show : ""
          }`}
          onClick={handleCircleButtonClick}
        >
          <button>약속 만들기</button>
          <button>방번호로 참여</button>
        </section>
      </main>
    </>
  );
};

export default AppointmentsPage;

// 더미 데이터
// types.ts
export interface AppointmentInfo {
  id: number;
  title: string; // 제목
  startDate: Date; // 시작 날짜
  endDate: Date; // 종료 날짜
  participants: string[]; // 참여자 프로필 이미지 리스트
  extraParticipants: number; // 추가 참여자 수
  location: string; // 위치
}

// data.ts
export const dummyListBoxData: AppointmentInfo[] = [
  {
    id: 1,
    title: "저녁에 치맥",
    startDate: new Date(2025, 0, 30, 18, 0),
    endDate: new Date(2025, 0, 31),
    participants: ["😀", "😀", "😀", "😀", "😀"],
    extraParticipants: 1,
    location: "홍대입구역",
  },
  {
    id: 2,
    title: "영화 관람",
    startDate: new Date(2025, 0, 27, 18, 0),
    endDate: new Date(2025, 0, 31),
    participants: ["😊", "😎", "🙂"],
    extraParticipants: 2,
    location: "강남역",
  },
  {
    id: 3,
    title: "오전 커피 모임",
    startDate: new Date(2025, 0, 25, 10, 0), // 2025.01.25 10:00
    endDate: new Date(2025, 0, 25), // 2025.01.25
    participants: ["☕", "😊", "🤗"],
    extraParticipants: 0,
    location: "을지로입구역",
  }
];

// 유틸 함수 모음
// utils/dateUtils.ts
const getFormattedDateParts = (date: Date) => {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dayName = dayNames[date.getDay()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return { year, month, day, dayName, hours, minutes };
};

export const formatDate = (date: Date): string => {
  const { year, month, day, dayName } = getFormattedDateParts(date);
  return `${year}.${month}.${day}(${dayName})`;
};

export const formatTime = (date: Date): string => {
  const { year, month, day, dayName, hours, minutes } =
    getFormattedDateParts(date);
  return `${year}.${month}.${day}(${dayName}) ${hours}:${minutes}`;
};

export const calculateCountdown = (startDate: Date): string => {
  const today = new Date();
  const timeDiff = startDate.getTime() - today.getTime(); // 시간 차이 (밀리초)
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 밀리초 -> 일 단위로 변환

  if (daysLeft < 0) return "종료"; // 이미 지난 날짜
  if (daysLeft === 0) return "D-Day"; // 당일
  return `D-${daysLeft}`;
};
