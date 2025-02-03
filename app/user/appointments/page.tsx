"use client";

import React, { useState } from "react";
import styles from "./Appointments.module.scss";
import { SlMagnifier } from "react-icons/sl";
import TabMenu from "../../../components/tabMenu/TabMenu";
import AppointmentList from "./components/AppointmentList";
import CircleButton from "@/components/circleButton/CircleButton";
import Link from "next/link";
import Modal from "@/components/modal/Modal";
import InputField from "@/components/input-filed/InputFiled";
import Button from "@/components/button/Button";
import IconHeader from "@/components/header/IconHeader";
import { calculateCountdown } from "@/utils/dateUtils/dateUtils";
import { AppointmentCardDto } from "@/application/usecases/appointment/dto/AppointmentCardDto";

const AppointmentsPage: React.FC = () => {
  const tabs = ["투표 진행중", "약속 리스트"];
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("전체");
  const [roomNumber, setRoomNumber] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRoomNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomNumber(e.target.value);
    console.log(roomNumber);
  };

  // 투표중인 약속 데이터
  const inProgressAppointments = appointments.filter(
    (appointment) => appointment.startDate && appointment.endDate
  );

  // 확정된 약속 데이터
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.confirmDate
  );

  const handleTabChange = (index: number) => {
    setCurrentTab(index);
  };

  const handleCircleButtonClick = () => {
    setShowButtons((prev) => !prev);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  // 검색
  const filteredAppointments = (appointments: AppointmentCardDto[]) => {
    return appointments
      .filter((appointment) => {
        if (selectedOption === "방장" && !appointment.isCreator) {
          return false;
        }
        if (
          selectedOption === "예정" &&
          !calculateCountdown(appointment.confirmDate!).includes("D-")
        ) {
          return false;
        }
        if (
          selectedOption === "종료" &&
          calculateCountdown(appointment.confirmDate!) !== "종료"
        ) {
          return false;
        }
        return true;
      })
      .filter((appointment) => {
        return appointment.title
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
  };

  return (
    <>
      <IconHeader />
      <TabMenu tabs={tabs} onTabChange={handleTabChange} />
      <main className={styles.container}>
        <section className={styles.searchBox}>
          <select onChange={handleSelectChange} value={selectedOption}>
            <option value="전체">전체</option>
            <option value="방장">내가 방장인 약속</option>
            {currentTab === 1 && (
              <>
                <option value="예정">예정된 약속</option>
                <option value="종료">종료된 약속</option>
              </>
            )}
          </select>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="방 제목을 입력하세요."
            />
            <SlMagnifier />
          </div>
        </section>

        <section className={styles.listBox}>
          {currentTab === 0 && (
            <AppointmentList
              appointments={filteredAppointments(inProgressAppointments)}
            />
          )}
          {currentTab === 1 && (
            <AppointmentList
              appointments={filteredAppointments(confirmedAppointments)}
            />
          )}
        </section>

        {/* 하단 + 버튼 */}
        <CircleButton onClick={handleCircleButtonClick} />
        <section
          className={`${styles.buttonBox} ${showButtons ? styles.show : ""}`}
          onClick={handleCircleButtonClick}
        >
          <Link href={"/user/appointments/create/information"}>
            약속 만들기
          </Link>
          <button onClick={openModal}>방번호로 참여</button>
        </section>
      </main>

      {/* 모달 */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.roomEntryBox}>
          <InputField
            label="방 번호"
            value={roomNumber}
            onChange={handleRoomNumberChange}
            type="text"
          />
          <Button size="sm" text="참여" />
        </div>
      </Modal>
    </>
  );
};

export default AppointmentsPage;

// 더미 데이터
export const appointments: AppointmentCardDto[] = [
  {
    id: 1,
    title: "저녁에 치맥",
    startDate: new Date(2025, 0, 30, 18, 0),
    endDate: new Date(2025, 0, 31),
    participants: ["😀", "😀", "😀", "😀", "😀"],
    isCreator: true,
    extraParticipants: 3,
  },
  {
    id: 2,
    title: "영화 관람",
    startDate: new Date(2025, 0, 27, 18, 0),
    endDate: new Date(2025, 0, 28),
    participants: ["😊", "😎"],
    isCreator: false,
    extraParticipants: 0,
  },
  {
    id: 3,
    title: "확정된 저녁 약속",
    confirmDate: new Date(2025, 1, 3, 19, 0),
    confirmPlace: "홍대입구역",
    participants: ["😀", "😀", "😀"],
    isCreator: true,
    extraParticipants: 0,
  },
  {
    id: 4,
    title: "확정된 영화 약속",
    confirmDate: new Date(2025, 0, 28, 18, 0),
    confirmPlace: "강남역",
    participants: ["😊", "😎", "🙂", "😎", "🙂"],
    isCreator: false,
    extraParticipants: 1,
  },
  {
    id: 5,
    title: "확정된 영화 약속",
    confirmDate: new Date(2025, 0, 25, 18, 0),
    confirmPlace: "강남역",
    participants: ["😊", "😎", "🙂", "😎", "🙂"],
    isCreator: false,
    extraParticipants: 1,
  },
  {
    id: 6,
    title: "확정된 저녁 약속",
    confirmDate: new Date(2025, 0, 31, 19, 0),
    confirmPlace: "홍대입구역",
    participants: ["😀", "😀", "😀"],
    isCreator: true,
    extraParticipants: 0,
  },
  {
    id: 7,
    title: "확정된 영화 약속",
    confirmDate: new Date(2025, 0, 27, 18, 0),
    confirmPlace: "강남역",
    participants: ["😊", "😎", "🙂", "😎", "🙂"],
    isCreator: false,
    extraParticipants: 1,
  },
  {
    id: 8,
    title: "확정된 영화 약속",
    confirmDate: new Date(2025, 0, 25, 18, 0),
    confirmPlace: "강남역",
    participants: ["😊", "😎", "🙂", "😎", "🙂"],
    isCreator: false,
    extraParticipants: 1,
  },
];
