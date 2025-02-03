"use client";

import Modal from "@/components/modal/Modal";
import styles from "./NoticeDetail.module.scss";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import Button from "@/components/button/Button";
import NoticeBox from "../NoticeBox/NoticeBox";
import { Notice } from "../../detail/types/detailTypes";

interface NoticeDetailProps {
  noticeData: Notice[];  
}

const NoticeDetail = ({ noticeData }: NoticeDetailProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoticeContent, setNewNoticeContent] = useState(""); // 새 공지사항 내용

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRegister = () => {
    if (newNoticeContent.trim()) {
      alert("등록되었습니다");
      closeModal(); // 모달 닫기
      setNewNoticeContent(""); // 입력 내용 초기화
    } else {
      alert("공지사항 내용을 입력해주세요.");
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
            noticeData.map((noticeItem, index) => (
              <NoticeBox key={index} content={noticeItem.content} />
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
              onChange={(e) => setNewNoticeContent(e.target.value)} // 입력값 업데이트
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
