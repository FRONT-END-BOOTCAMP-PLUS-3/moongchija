"use client";

import styles from "./mypage.module.scss";
import Button from "@/components/button/Button";
import { useState } from "react";
import Modal from "@/components/modal/Modal";
import DeleteAccountModalContent from "./components/DeleteAccountModalContent";
import MyCalendar from "./components/MyCalendar";
import IconHeader from "@/components/header/IconHeader";
import UserAppointmentCount from "./components/UserAppointmentCount";
import { Event } from "@/types/Event";
import UserName from "./components/UserName";
import UserImage from "./components/UserImage";

const MyPagePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Event[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const handleopenModal = () => setIsModalOpen(true);
  const handlecloseModal = () => setIsModalOpen(false);

  return (
    <>
      <IconHeader showUsername={false} />
      <div className={styles.myPagecontainer}>
        <div className={styles.profileWrapper}>
          <UserImage />
          <UserName />
        </div>
        <div>
          <UserAppointmentCount
            appointments={appointments}
            onStatusChange={setSelectedStatus}
          />
        </div>
        <div className={styles.calendarWrapper}>
          <MyCalendar
            onAppointmentsFetch={setAppointments}
            selectedStatus={selectedStatus}
          />
        </div>

        <div className={styles.deleteAccountButton}>
          <Button
            text="탈퇴하기"
            size="sm"
            color="--exit-red"
            onClick={handleopenModal}
          />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handlecloseModal}>
        <DeleteAccountModalContent onClose={handlecloseModal} />
      </Modal>
    </>
  );
};

export default MyPagePage;
