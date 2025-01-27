import Modal from "@/components/modal/Modal";
import styles from "./NoticeBox.module.scss";
import { FaEdit, FaTrash } from "react-icons/fa";
import Button from "@/components/button/Button";
import { useState } from "react";

const NoticeBox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRegister = () => {
    alert("수정되었습니다");
    closeModal();
  };

  return (
    <>
      <div className={styles.box}>
        <div>늦지마요늦지마요늦지마요</div>
        <div className={styles.icons}>
          <FaEdit className={styles.editIcon} onClick={openModal} />
          <FaTrash className={styles.trashIcon} />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.modalContainer}>
          <div className={styles.modalBox}>
            <span className={styles.title}>공지사항 수정하기</span>
            <textarea className={styles.content} defaultValue="원래 내용" />
            <div className={styles.editButton}>
              <Button
                text="수정하기"
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

export default NoticeBox;
