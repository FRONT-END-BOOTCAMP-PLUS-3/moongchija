"use client";

import React from "react";
import Link from "next/link";
import styles from "./Appointments.module.scss";
import CircleButton from "@/components/circleButton/CircleButton";
import IconHeader from "@/components/header/IconHeader";
import TabMenu from "../../../components/tabMenu/TabMenu";
import Loading from "@/components/loading/Loading";
import Modal from "@/components/modal/Modal";
import AppointmentList from "./components/AppointmentList";
import EntryAppointmentModal from "./components/EntryAppointmentModal";
import useAppointments from "./hooks/useAppointments";
import { SlMagnifier } from "react-icons/sl";

const tabs = ["투표 진행중", "약속 리스트"];

const AppointmentsPage: React.FC = () => {
  const {
    hooks: {
      loading,
      currentTab,
      showButtons,
      searchText,
      selectedOption,
      isModalOpen,
      filteredAppointments,
      inProgressAppointments,
      confirmedAppointments,
      setAppointments
    },
    handlers: {
      openModal,
      closeModal,
      handleTabChange,
      handleCircleButtonClick,
      handleSearchChange,
      handleSelectChange,
    }
  } = useAppointments();

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
          {loading && <Loading />}
          {/* 투표중 약속 */}
          {!loading && currentTab === 0 && (
            <AppointmentList
              appointments={filteredAppointments(inProgressAppointments)}
              onSetAppointments={setAppointments}
            />
          )}
          {/* 확정된 약속 */}
          {!loading && currentTab === 1 && (
            <AppointmentList
              appointments={filteredAppointments(confirmedAppointments)}
              onSetAppointments={setAppointments}
            />
          )}
        </section>

        {/* 하단 + 버튼 */}
        <CircleButton onClick={handleCircleButtonClick} />
        <section
          className={`${styles.buttonBox} ${showButtons ? styles.show : ""}`}
          onClick={handleCircleButtonClick}
        >
          <Link href={"/user/appointments/create"}>
            약속 만들기
          </Link>
          <button onClick={openModal}>방번호로 참여</button>
        </section>
      </main>

      {/* 모달 */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
          <EntryAppointmentModal />
      </Modal>
    </>
  );
};

export default AppointmentsPage;