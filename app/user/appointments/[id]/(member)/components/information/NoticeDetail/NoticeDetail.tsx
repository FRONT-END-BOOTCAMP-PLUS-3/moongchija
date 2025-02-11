"use client";

import Modal from "@/components/modal/Modal";
import styles from "./NoticeDetail.module.scss";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import Button from "@/components/button/Button";
import NoticeBox from "../NoticeBox/NoticeBox";

interface NoticeDetailProps {
  appointmentId: number; // Appointment ID
  noticeData?: { id: number; descript: string; createdAt: Date }[];
  ownerId: string; // 방장 ID
  userId: string | null; // 유저 ID
}

const NoticeDetail = ({
  appointmentId,
  noticeData: initialNotices = [],
  ownerId,
  userId,
}: NoticeDetailProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoticeContent, setNewNoticeContent] = useState("");
  const [noticeData, setNoticeData] = useState(initialNotices);

  // 공지사항 가져오기 GET
  const fetchNotices = async () => {
    try {
      const response = await fetch(
        `/api/user/appointments/${appointmentId}/information`
      );
      if (!response.ok) throw new Error("공지사항 불러오기 실패");

      const data = await response.json();
      setNoticeData(data.notices);
    } catch (error) {
      console.error(error);
      alert("공지사항을 불러오는 데 실패했습니다.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 공지사항 등록 POST
  const handleRegister = async () => {
    if (!newNoticeContent.trim()) {
      alert("공지사항 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `/api/user/appointments/${appointmentId}/information`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            descript: newNoticeContent,
            appointmentId: Number(appointmentId),
          }),
        }
      );

      if (!response.ok) throw new Error("공지사항 등록 실패");

      alert("등록되었습니다");
      closeModal();
      setNewNoticeContent("");
      await fetchNotices();
    } catch (error) {
      console.error(error);
      alert("공지사항 등록에 실패했습니다.");
    }
  };

  // 수정 시 업데이트하는 콜백
  const handleNoticeUpdate = (updatedNotice: {
    noticeId: number;
    content: string;
  }) => {
    setNoticeData((prevNoticeData) =>
      prevNoticeData.map((notice) =>
        notice.id === updatedNotice.noticeId
          ? { ...notice, descript: updatedNotice.content }
          : notice
      )
    );
  };

  // 삭제 시 해당 공지사항을 목록에서 제거하는 콜백
  const handleNoticeDelete = (noticeId: number) => {
    setNoticeData((prevNoticeData) =>
      prevNoticeData.filter((notice) => notice.id !== noticeId)
    );
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <span>공지사항</span>
          {userId === ownerId ? (
            <FaPlus className={styles.plusIcon} onClick={openModal} />
          ) : null}
        </div>

        <div className={styles.wrapper}>
          {noticeData.length > 0 ? (
            noticeData.map((noticeItem) => (
              <NoticeBox
                key={noticeItem.id}
                noticeId={noticeItem.id}
                content={noticeItem.descript}
                appointmentId={appointmentId}
                onNoticeUpdate={handleNoticeUpdate}
                onNoticeDelete={handleNoticeDelete} // 삭제 콜백 전달
                userId={userId}
                ownerId={ownerId}
              />
            ))
          ) : (
            <div className={styles.noNotice}>공지사항이 없습니다.</div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.noticeModalContainer}>
          <div className={styles.noticeModalBox}>
            <span className={styles.noticeTitle}>공지사항 글쓰기</span>
            <textarea
              className={styles.noticeContent}
              placeholder="공지사항을 작성해주세요."
              value={newNoticeContent}
              onChange={(e) => setNewNoticeContent(e.target.value)}
            />

            <div className={styles.noticeButton}>
              <Button
                text="등록"
                size="sm"
                color="--primary-color"
                active={true}
                onClick={handleRegister}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NoticeDetail;
