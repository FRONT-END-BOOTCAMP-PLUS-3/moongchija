"use client";

import styles from "./mypage.module.scss";
import Button from "@/components/button/Button";
import { useState } from "react";
import Modal from "@/components/modal/Modal";
import DeleteAccountModalContent from "./components/DeleteAccountModalContent";
import UserProfile from "./components/UserProfile";
import MyCalendar from "./components/MyCalendar";
import { useRouter } from "next/navigation";

const MyPagePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleopenModal = () => setIsModalOpen(true);
  const handlecloseModal = () => setIsModalOpen(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("token");
        router.push("/");
        console.log("로그아웃 성공:", data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.myPagecontainer}>
      <div className={styles.profileWrapper}>
        <UserProfile />
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
        <Button text="로그 아웃" size="sm" onClick={handleLogout} />
        <Modal isOpen={isModalOpen} onClose={handlecloseModal}>
          <DeleteAccountModalContent />
        </Modal>
      </div>
    </div>
  );
};

export default MyPagePage;
