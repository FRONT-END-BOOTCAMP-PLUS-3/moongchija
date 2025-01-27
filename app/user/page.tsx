"use client";

import Calendar from "./components/Calendar";
import styles from "./mypage.module.scss";
import Button from "@/components/button/Button";
import { useState } from "react";
import Modal from "@/components/modal/Modal";
import DeleteAccountModalContent from "./components/DeleteAccountModalContent";
import UserProfile from "./components/UserProfile";

const MyPagePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleopenModal = () => setIsModalOpen(true);
  const handlecloseModal = () => setIsModalOpen(false);

  return (
    <div className={styles.myPagecontainer}>
      <div className={styles.profileWrapper}>
        <UserProfile />
      </div>

      <div className={styles.calendarWrapper}>
        <Calendar />
      </div>

      <div className={styles.deleteAccountButton}>
        <Button
          text="탈퇴하기"
          size="sm"
          color="--exit-red"
          onClick={handleopenModal}
        />
        <Modal isOpen={isModalOpen} onClose={handlecloseModal}>
          <DeleteAccountModalContent />
        </Modal>
      </div>
    </div>
  );
};

export default MyPagePage;
