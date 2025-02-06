"use client";

import styles from "./mypage.module.scss";
import Button from "@/components/button/Button";
import { useState } from "react";
import Modal from "@/components/modal/Modal";
import DeleteAccountModalContent from "./components/DeleteAccountModalContent";
import UserProfile from "./components/UserProfile";
import MyCalendar from "./components/MyCalendar";
import IconHeader from "@/components/header/IconHeader";
import UserAppointmentCount from "./components/UserAppointmentCount";

const MyPagePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleopenModal = () => setIsModalOpen(true);
  const handlecloseModal = () => setIsModalOpen(false);

  return (
    <>
      <IconHeader showUsername={false} />
      <div className={styles.myPagecontainer}>
        <div className={styles.profileWrapper}>
          <UserProfile />
          <UserAppointmentCount />
        </div>
        <div className={styles.calendarWrapper}>
          <MyCalendar />
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
        <DeleteAccountModalContent />
      </Modal>
    </>
  );
};

export default MyPagePage;
