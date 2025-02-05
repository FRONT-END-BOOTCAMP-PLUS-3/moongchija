"use client";

import Modal from "@/components/modal/Modal";
import styles from "./NoticeDetail.module.scss";
import { FaPlus } from "react-icons/fa";
import { useState,} from "react";
import Button from "@/components/button/Button";
import NoticeBox from "../NoticeBox/NoticeBox";

interface NoticeDetailProps {
  appointmentId: number; // 약속 ID
  noticeData?: { id: number; descript: string; createdAt: Date }[];
}

const NoticeDetail = ({ appointmentId, noticeData: initialNotices = [] }: NoticeDetailProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoticeContent, setNewNoticeContent] = useState(""); // 새 공지사항 내용
  const [noticeData, setNoticeData] = useState(initialNotices); // 공지사항 상태 관리

  const fetchNotices = async () => {
    try {
      const response = await fetch(`/api/user/appointments/${appointmentId}/information`);
      if (!response.ok) throw new Error("공지사항 불러오기 실패");

      const data = await response.json();
      setNoticeData(data.notices); // 최신 공지사항 목록 업데이트
    } catch (error) {
      console.error(error);
      alert("공지사항을 불러오는 데 실패했습니다.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRegister = async () => {
    if (!newNoticeContent.trim()) {
      alert("공지사항 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`/api/user/appointments/${appointmentId}/information`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descript: newNoticeContent,
          appointmentId: Number(appointmentId),
        }),
      });

      if (!response.ok) throw new Error("공지사항 등록 실패");

      alert("등록되었습니다");
      closeModal(); // 모달 닫기
      setNewNoticeContent(""); // 입력 내용 초기화
      await fetchNotices(); // 최신 공지사항 목록 다시 불러오기
    } catch (error) {
      console.error(error);
      alert("공지사항 등록에 실패했습니다.");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <span>공지사항</span>
          <FaPlus className={styles.plusIcon} onClick={openModal} />
        </div>

        <div className={styles.wrapper}>
          {noticeData.length > 0 ? (
            noticeData.map((noticeItem) => (
              <NoticeBox key={noticeItem.id} content={noticeItem.descript} />
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
