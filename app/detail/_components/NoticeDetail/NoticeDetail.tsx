"use client";

import Modal from "@/components/modal/Modal";
import styles from "./NoticeDetail.module.scss";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import Button from "@/components/button/Button";

const NoticeDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <span>공지사항</span>
          <FaPlus className={styles.plusIcon} onClick={openModal} />
        </div>

        {/* 공지사항 개별 박스 */}
        <div className={styles.wrapper}>
          <div className={styles.box}>
            <div>늦지마요늦지마요늦지마요</div>
            <div>
              <FaEdit className={styles.editIcon} />
              <FaTrash className={styles.trashIcon} />
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.noticeModalContainer}>
          <div className={styles.noticeModalBox}>
            <span className={styles.noticeTitle}>공지사항 글쓰기</span>
              <textarea className={styles.noticeContent}   placeholder="공지사항을 작성해주세요."></textarea>
            <div  className={styles.noticeButton}>
            <Button
              text="등록"
              size="sm"
              color="--primary-color"
              active={true}
              onClick={closeModal}
             
            />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NoticeDetail;
